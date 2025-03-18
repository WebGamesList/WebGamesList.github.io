// Get URL parameters for deep linking
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

// Find a game by ID (title used as ID)
function findGameById(gameId) {
    // Check featured game
    if (gamesData.featured.title.replace(/\s+/g, '-').toLowerCase() === gameId) {
        return gamesData.featured;
    }
    
    // Check all categories
    for (const category of gamesData.categories) {
        for (const game of category.games) {
            if (game.title.replace(/\s+/g, '-').toLowerCase() === gameId) {
                return game;
            }
        }
    }
    
    return null;
}

// Setup page based on URL parameters
function setupPageFromUrl() {
    const params = getUrlParams();
    
    // If we have a game parameter, show dedicated preview
    if (params.game) {
        const game = findGameById(params.game);
        
        if (game) {
            // Add preview mode class to body
            document.body.classList.add('preview-mode');
            
            // Hide categories
            document.querySelector('.categories').style.display = 'none';
            
            // Setup hero as dedicated preview
            const heroVideo = document.getElementById('hero-video');
            heroVideo.src = game.videoUrl;
            document.querySelector('.hero-content h1').textContent = game.title;
            document.querySelector('.hero-content p').textContent = game.description;
            
            // Update play button
            const playBtn = document.querySelector('.hero-content .play-btn');
            playBtn.onclick = () => window.open(game.gameUrl, '_blank');
            
            // Add back button
            const backBtn = document.createElement('button');
            backBtn.className = 'back-btn';
            backBtn.textContent = 'Back to Games';
            backBtn.onclick = () => window.location.href = window.location.pathname;
            document.querySelector('.hero-content').appendChild(backBtn);
            
            // Update page title
            document.title = `${game.title} - Free 3D Game Preview`;
            
            return true; // We're in preview mode
        }
    }
    
    return false; // Normal mode
}

// Initialize hero section
function initializeHero() {
    const heroVideo = document.getElementById('hero-video');
    heroVideo.src = gamesData.featured.videoUrl;
    document.querySelector('.hero-content h1').textContent = gamesData.featured.title;
    document.querySelector('.hero-content p').textContent = gamesData.featured.description;
    document.querySelector('.hero-content .play-btn').onclick = () => window.open(gamesData.featured.gameUrl, '_blank');
}

// Initialize game rows
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Create unique ID from title
    const gameId = game.title.replace(/\s+/g, '-').toLowerCase();
    
    card.innerHTML = `
        <img src="${game.thumbnailUrl}" alt="${game.title}">
        <video muted loop>
            <source src="${game.videoUrl}" type="video/webm">
        </video>
        <div class="game-info">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <button class="expand-btn">↓</button>
        </div>
    `;

    // Handle hover video playback
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => {
        video.play();
    });
    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });

    // Handle expand button click
    const expandBtn = card.querySelector('.expand-btn');
    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(game);
    });

    // Handle card click for game launch
    card.addEventListener('click', () => {
        window.open(game.gameUrl, '_blank');
    });

    return card;
}

function openModal(game) {
    const modal = document.getElementById('preview-modal');
    const video = modal.querySelector('video');
    const title = modal.querySelector('h2');
    const description = modal.querySelector('p');
    const playBtn = modal.querySelector('.play-btn');

    // Create share link
    const gameId = game.title.replace(/\s+/g, '-').toLowerCase();
    const shareUrl = `${window.location.origin}${window.location.pathname}?game=${gameId}`;
    
    // Add share button if not already there
    if (!modal.querySelector('.share-btn')) {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.textContent = 'Share';
        shareBtn.onclick = () => {
            // Use clipboard API to copy the URL
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Link copied to clipboard: ' + shareUrl);
            });
        };
        modal.querySelector('.modal-info').appendChild(shareBtn);
    }

    video.src = game.videoUrl;
    title.textContent = game.title;
    description.textContent = game.description;
    playBtn.onclick = () => window.open(game.gameUrl, '_blank');

    modal.style.display = 'block';
    video.play();
}

// Initialize modal close button
document.querySelector('.close-modal').addEventListener('click', () => {
    const modal = document.getElementById('preview-modal');
    const video = modal.querySelector('video');
    modal.style.display = 'none';
    video.pause();
    video.currentTime = 0;
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('preview-modal');
        const video = modal.querySelector('video');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
            video.pause();
            video.currentTime = 0;
        }
    }
});

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if we should show a specific game preview
    const isPreviewMode = setupPageFromUrl();
    
    if (!isPreviewMode) {
        // Normal initialization
        initializeHero();
        
        // Populate game rows
        gamesData.categories.forEach(category => {
            const categoryElement = Array.from(document.querySelectorAll('.category'))
                .find(el => el.querySelector('h2').textContent === category.name);
            
            if (categoryElement) {
                const gameRow = categoryElement.querySelector('.game-row');
                category.games.forEach(game => {
                    gameRow.appendChild(createGameCard(game));
                });
            }
        });
    }
});
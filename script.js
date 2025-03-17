// Initialize hero section
const heroVideo = document.getElementById('hero-video');
heroVideo.src = gamesData.featured.videoUrl;
document.querySelector('.hero-content h1').textContent = gamesData.featured.title;
document.querySelector('.hero-content p').textContent = gamesData.featured.description;
document.querySelector('.hero-content .play-btn').onclick = () => window.open(gamesData.featured.gameUrl, '_blank');

// Initialize game rows
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
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
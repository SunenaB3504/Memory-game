document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const matchesDisplay = document.getElementById('matches');
    const attemptsDisplay = document.getElementById('attempts');
    const startButton = document.getElementById('startGame');
    const themeSelect = document.getElementById('theme');

    let cards = [];
    let flippedCards = [];
    let matches = 0;
    let attempts = 0;

    // Sample card content based on themes (expand with AI-generated content)
    const themes = {
        animals: ['🐘', '🦒', '🐅', '🦁', '🐘', '🦒', '🐅', '🦁'],
        cartoon: ['🦁', '🐻', '🐰', '🦊', '🦁', '🐻', '🐰', '🦊'],
        fashion: ['👗', '👠', '👜', '💍', '👗', '👠', '👜', '💍']
    };

    // Load saved progress
    const savedData = JSON.parse(localStorage.getItem('niaMemoryGame')) || { matches: 0, attempts: 0 };
    matches = savedData.matches;
    attempts = savedData.attempts;
    updateScoreBoard();

    startButton.addEventListener('click', startGame);

    function startGame() {
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        const selectedTheme = themeSelect.value;
        const cardValues = themes[selectedTheme];
        shuffle(cardValues);
        createBoard(cardValues);
    }

    function createBoard(values) {
        for (let i = 0; i < 8; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = values[i];
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.value;
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                attempts++;
                checkMatch();
            }
            updateScoreBoard();
            saveProgress();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matches++;
            flippedCards = [];
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
                flippedCards = [];
            }, 1000);
        }
        if (matches === 4) {
            setTimeout(() => alert('Great job, Nia! You matched all cards!'), 500);
        }
    }

    function updateScoreBoard() {
        matchesDisplay.textContent = matches;
        attemptsDisplay.textContent = attempts;
    }

    function saveProgress() {
        localStorage.setItem('niaMemoryGame', JSON.stringify({ matches, attempts }));
    }
});
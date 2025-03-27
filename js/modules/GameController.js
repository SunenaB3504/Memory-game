// Main game controller that orchestrates the game flow

class GameController {
    constructor() {
        // Initialize state
        this.firstCard = null;
        this.secondCard = null;
        this.thirdCard = null;
        this.lockBoard = false;
        this.matches = 0;
        this.attempts = 0;
        this.cardPairs = 0;
        this.matchGroups = [];
        
        // Initialize components
        this.ui = new UIController();
        this.cardManager = new CardManager();
        this.gameModes = new GameModes(this);
        
        // Settings
        this.currentProficiency = 'easy';
        this.currentDifficulty = 'medium';
        
        // DOM elements
        this.themeSelect = document.getElementById('theme');
        this.proficiencySelect = document.getElementById('proficiency');
        this.difficultySelect = document.getElementById('difficulty');
        this.startButton = document.getElementById('startGame');
        
        // Event listeners
        this.startButton.addEventListener('click', () => this.startGame());
    }
    
    // Start game with selected settings
    startGame() {
        console.log("Starting game...");
        this.resetGame();
        
        const theme = this.themeSelect.value;
        this.currentProficiency = this.proficiencySelect.value;
        this.currentDifficulty = this.difficultySelect.value;
        
        console.log(`Theme: ${theme}, Proficiency: ${this.currentProficiency}, Difficulty: ${this.currentDifficulty}`);
        
        // Check for multi-name themes
        if (theme === 'emojiToMultipleEnglish' || theme === 'emojiToMultipleHindi') {
            this.setupMultiNameGame(theme);
            return;
        }
        
        // Check for numbers theme and proficiency combinations
        if (theme === 'numbers') {
            switch (this.currentProficiency) {
                case 'easy':
                    this.setupNumberAdditionGame();
                    return;
                case 'warning':
                    this.setupNumberMultiplicationGame();
                    return;
                case 'danger':
                    this.setupNumberArithmeticGame();
                    return;
            }
        }
        
        // Original proficiency-based setup for other themes
        switch(this.currentProficiency) {
            case 'easy':
                this.setupEasyLevel(theme);
                break;
            case 'warning':
                this.setupWarningLevel(theme);
                break;
            case 'danger':
                this.setupDangerLevel(theme);
                break;
        }
    }
    
    // Reset game state
    resetGame() {
        this.ui.resetUI();
        
        this.firstCard = null;
        this.secondCard = null;
        this.thirdCard = null;
        this.lockBoard = false;
        this.matches = 0;
        this.attempts = 0;
        this.matchGroups = [];
        this.ui.updateScore(this.matches, this.attempts);
    }
    
    // Setup easy level
    setupEasyLevel(theme) {
        const diffSettings = difficultySettings[this.currentDifficulty];
        console.log(`Setting up Easy level with ${diffSettings.pairsCount} pairs...`);
        
        // Create cards
        const cards = this.cardManager.createStandardCards(theme, diffSettings.pairsCount);
        console.log(`Created ${cards.length} cards`);
        
        // Setup UI
        const board = this.ui.setupEasyUI(this.currentDifficulty);
        
        // Display cards
        this.ui.displayCards(cards, board, 'easy', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'easy');
        });
        
        this.cardPairs = diffSettings.pairsCount;
        console.log(`Game board ready with ${this.cardPairs} pairs to match`);
    }
    
    // Setup warning level
    setupWarningLevel(theme) {
        const diffSettings = difficultySettings[this.currentDifficulty];
        const profSettings = proficiencySettings.warning;
        
        // Adjust pair counts for warning level
        const totalParts = profSettings.section1Ratio + profSettings.section2Ratio;
        const section1Count = Math.floor(diffSettings.pairsCount * profSettings.section1Ratio / totalParts);
        
        // Setup UI
        const boards = this.ui.setupWarningUI(profSettings);
        
        // Create cards
        const { section1Cards, section2Cards } = this.cardManager.createWarningLevelCards(theme, section1Count);
        
        // Display cards
        this.ui.displayCards(section1Cards, boards.section1, 'warning', this.currentDifficulty);
        this.ui.displayCards(section2Cards, boards.section2, 'warning', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'warning');
        });
        
        this.cardPairs = section1Count;
    }
    
    // Setup danger level
    setupDangerLevel(theme) {
        const diffSettings = difficultySettings[this.currentDifficulty];
        const profSettings = proficiencySettings.danger;
        
        // Adjust groups count
        const groupsCount = Math.floor(diffSettings.pairsCount / 2);
        
        // Create cards
        const cards = this.cardManager.createDangerLevelCards(theme, groupsCount);
        
        // Setup UI
        const board = this.ui.setupDangerUI(profSettings.gridAdjustment);
        
        // Display cards
        this.ui.displayCards(cards, board, 'danger', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'danger');
        });
        
        this.cardPairs = groupsCount;
    }
    
    // Setup multi-name game
    setupMultiNameGame(theme) {
        const diffSettings = difficultySettings[this.currentDifficulty];
        
        // Adjust pairs count
        const adjustedPairsCount = Math.floor(diffSettings.pairsCount / 2);
        
        // Create cards
        const cards = this.cardManager.createMultiNameCards(theme, adjustedPairsCount);
        
        // Setup UI
        const board = this.ui.setupMultiNameUI(this.currentDifficulty);
        
        // Display cards
        this.ui.displayCards(cards, board, 'multiname', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'multiname');
        });
        
        // Each emoji has 2 matching names
        this.cardPairs = adjustedPairsCount * 2;
    }
    
    // Setup for Number theme with addition operations (Easy level)
    setupNumberAdditionGame() {
        const diffSettings = difficultySettings[this.currentDifficulty];
        
        // Create cards
        const cards = this.cardManager.createNumberAdditionCards(Math.floor(diffSettings.pairsCount / 3) * 2);
        
        // Calculate how many matches to expect (2 matches per trio)
        const matchCount = cards.length / 3 * 2; 
        
        // Setup UI with info about matching
        const board = this.ui.setupEasyUI(this.currentDifficulty);
        
        // Add explanation
        const infoElement = document.createElement('div');
        infoElement.className = 'game-info';
        infoElement.innerHTML = '<p>Match each number with two other numbers that add up to it! Example: 10 matches with both 7 and 3.</p>';
        board.before(infoElement);
        
        // Display cards
        this.ui.displayCards(cards, board, 'easy', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'easy');
        });
        
        this.cardPairs = matchCount;
    }
    
    // Setup for Number theme with multiplication operations (Warning level)
    setupNumberMultiplicationGame() {
        const diffSettings = difficultySettings[this.currentDifficulty];
        
        // Create cards
        const cards = this.cardManager.createNumberMultiplicationCards(Math.floor(diffSettings.pairsCount / 3) * 2);
        
        // Calculate how many matches to expect (2 matches per trio)
        const matchCount = cards.length / 3 * 2;
        
        // Setup UI with info about matching
        const board = this.ui.setupEasyUI(this.currentDifficulty);
        
        // Add explanation
        const infoElement = document.createElement('div');
        infoElement.className = 'game-info';
        infoElement.innerHTML = '<p>Match each number with two factors that multiply to give it! Example: 12 matches with both 3 and 4.</p>';
        board.before(infoElement);
        
        // Display cards
        this.ui.displayCards(cards, board, 'warning', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'warning');
        });
        
        this.cardPairs = matchCount;
    }
    
    // Setup for Number theme with any arithmetic operation (Danger level)
    setupNumberArithmeticGame() {
        const diffSettings = difficultySettings[this.currentDifficulty];
        
        // Create cards
        const cards = this.cardManager.createNumberArithmeticCards(diffSettings.pairsCount);
        
        // Setup UI
        const board = this.ui.setupDangerUI(6);
        
        // Add explanation
        const infoElement = document.createElement('div');
        infoElement.className = 'game-info';
        infoElement.innerHTML = '<p>Match each result with its calculation! Find the number, operator, and operand that form a correct equation.</p>';
        board.before(infoElement);
        
        // Display cards
        this.ui.displayCards(cards, board, 'danger', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'danger');
        });
        
        this.cardPairs = diffSettings.pairsCount;
    }
}

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
        
        // Initialize points system
        this.pointsSystem = new PointsSystem();
        
        // Game timing
        this.gameStartTime = null;
        this.lastMatchTime = null;
    }
    
    // Start game with selected settings
    startGame() {
        console.log("Starting game...");
        this.resetGame();
        
        const theme = this.themeSelect.value;
        this.currentProficiency = this.proficiencySelect.value;
        this.currentDifficulty = this.difficultySelect.value;
        
        console.log(`Theme: ${theme}, Proficiency: ${this.currentProficiency}, Difficulty: ${this.currentDifficulty}`);
        
        // Reset points for new game
        this.pointsSystem.resetGamePoints();
        
        // Update UI with points and level
        this.ui.updatePoints(0, this.pointsSystem.totalPoints);
        this.ui.updateLevel(this.pointsSystem.getLevelProgress());
        
        // Record game start time
        this.gameStartTime = Date.now();
        this.lastMatchTime = this.gameStartTime;
        
        // Check for spelling theme
        if (theme === 'englishSpellings') {
            this.setupSpellingGame();
            return;
        }
        
        // Check for word themes
        if (theme === 'englishWords' || theme === 'hindiWords') {
            this.setupWordMeaningGame(theme);
            return;
        }
        
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
    
    // Handle successful match
    handleSuccessfulMatch() {
        // Calculate time taken for this match
        const matchTime = (Date.now() - this.lastMatchTime) / 1000; // Convert to seconds
        this.lastMatchTime = Date.now();
        
        // Award points for the match
        const firstAttempt = this.attempts === this.matches; // Perfect matching so far
        const pointsEarned = this.pointsSystem.awardMatchPoints(
            this.currentDifficulty, 
            this.currentProficiency,
            firstAttempt,
            matchTime
        );
        
        // Update UI with points
        this.ui.updatePoints(this.pointsSystem.currentPoints, this.pointsSystem.totalPoints);
        
        // Show points animation near the matched cards
        if (this.firstCard && this.secondCard) {
            const rect = this.firstCard.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top;
            this.ui.showPointsEarned(pointsEarned, x, y);
        }
        
        // Update match count
        this.matches++;
        this.ui.updateScore(this.matches, this.attempts);
        
        // Check if game is complete
        if (this.matches === this.cardPairs) {
            // Add validation before declaring victory
            this.validateAndHandleGameCompletion();
        }
    }
    
    // Add a new method to validate matched cards before declaring victory
    validateAndHandleGameCompletion() {
        // Count matched cards on the board
        const matchedCards = document.querySelectorAll('.card.matched').length;
        const totalCards = document.querySelectorAll('.card').length;
        
        console.log(`Checking game completion: ${matchedCards} matched / ${totalCards} total cards`);
        
        // For multi-name games or special themes where a card can have more than one match
        if (this.themeSelect.value.includes('Multiple')) {
            // Specific validation for multi-name where emoji cards match with two name cards
            const emojiCards = document.querySelectorAll('.card[data-is-emoji="true"].matched').length;
            const nameCards = document.querySelectorAll('.card[data-is-name="true"].matched').length;
            
            console.log(`Multi-name check: ${emojiCards} emoji cards and ${nameCards} name cards matched`);
            
            // Each emoji should match with two name cards
            if (nameCards === emojiCards * 2) {
                // All emoji cards have two matching name cards
                this.handleGameCompletion();
            } else {
                console.log("Not all emoji cards have been matched with two names yet.");
            }
            return;
        }
        
        // For standard games
        if (matchedCards === totalCards) {
            // All cards on the board are matched
            this.handleGameCompletion();
        } else {
            // Not all cards are matched yet
            console.log(`Game not complete yet. ${matchedCards} of ${totalCards} cards matched.`);
            
            // Recalculate card pairs based on actual matched cards
            if (this.matches === this.cardPairs) {
                const remainingPairs = Math.ceil((totalCards - matchedCards) / 2);
                this.cardPairs = this.matches + remainingPairs;
                console.log(`Adjusting cardPairs to ${this.cardPairs}`);
            }
        }
    }
    
    // Handle game completion
    handleGameCompletion() {
        console.log("Game is complete! Showing game completion summary.");
        
        // Play success sound
        if (window.soundManager) {
            window.soundManager.play('success');
        }
        
        // Calculate game completion time
        const gameTime = (Date.now() - this.gameStartTime) / 1000; // seconds
        
        // Award points for game completion
        const results = this.pointsSystem.awardGameCompletionPoints(
            this.currentDifficulty, 
            this.currentProficiency,
            this.attempts,
            this.cardPairs,
            gameTime
        );
        
        // Update UI with final points
        this.ui.updatePoints(this.pointsSystem.currentPoints, this.pointsSystem.totalPoints);
        
        // Check and update level progress
        const leveledUp = this.pointsSystem.checkLevelProgression();
        this.ui.updateLevel(this.pointsSystem.getLevelProgress());
        
        if (leveledUp) {
            this.ui.showRewardMessage(`<h4>Level Up!</h4>You've reached level ${this.pointsSystem.level}!`, 'success');
        }
        
        // Display achievements
        this.ui.updateAchievements(this.pointsSystem.getUnlockedAchievements());
        
        // Show congratulation and game summary
        setTimeout(() => {
            // First show a quick alert for immediate feedback
            alert(`Congratulations! You completed the game in ${this.attempts} attempts.`);
            
            // Then show detailed summary
            this.ui.showGameSummary(results);
        }, 300);
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
        
        // Update points display
        if (this.pointsSystem) {
            this.ui.updatePoints(0, this.pointsSystem.totalPoints);
            this.ui.updateLevel(this.pointsSystem.getLevelProgress());
            this.ui.updateAchievements(this.pointsSystem.getUnlockedAchievements());
        }
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
    
    // Setup multi-name game (improved match counting)
    setupMultiNameGame(theme) {
        const diffSettings = difficultySettings[this.currentDifficulty];
        
        // Adjust pairs count - each emoji matches with two names
        const adjustedPairsCount = Math.floor(diffSettings.pairsCount / 3); 
        
        // Create cards - for each emoji we'll have two name cards
        const cards = this.cardManager.createMultiNameCards(theme, adjustedPairsCount);
        
        // Setup UI
        const board = this.ui.setupMultiNameUI(this.currentDifficulty);
        
        // Display cards
        this.ui.displayCards(cards, board, 'multiname', this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, 'multiname');
        });
        
        // Calculate the number of matches needed to win
        // For multi-name: each emoji (adjustedPairsCount) needs to match with TWO names
        this.cardPairs = adjustedPairsCount * 2;
        
        // Add extra logging for debugging
        console.log(`Multi-name game setup with ${this.cardPairs} pairs to match. ${cards.length} total cards created.`);
        console.log(`Game will complete when ${adjustedPairsCount} emoji cards match with ${adjustedPairsCount * 2} name cards`);
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
    
    // Setup for word to meaning matching
    setupWordMeaningGame(theme) {
        const diffSettings = difficultySettings[this.currentDifficulty];
        
        // Create cards
        const cards = this.cardManager.createWordMeaningCards(theme, diffSettings.pairsCount, this.currentProficiency);
        
        // Setup UI
        let board = this.ui.setupEasyUI(this.currentDifficulty);
        
        // Calculate card pairs based on proficiency
        let cardCount = 0;
        
        if (this.currentProficiency === 'easy') {
            // Add explanation for easy
            const infoElement = document.createElement('div');
            infoElement.className = 'game-info';
            infoElement.innerHTML = '<p>Match each word with its meaning!</p>';
            board.before(infoElement);
            
            cardCount = cards.length / 2;
        } 
        else if (this.currentProficiency === 'warning') {
            // Add explanation for warning
            const infoElement = document.createElement('div');
            infoElement.className = 'game-info';
            infoElement.innerHTML = '<p>Match each word with its possible meanings. Each word has multiple correct meanings!</p>';
            board.before(infoElement);
            
            // Count non-word cards to determine match count
            const wordCards = cards.filter(card => card.isWord);
            const meaningCards = cards.filter(card => card.isMeaning);
            cardCount = wordCards.length * (meaningCards.length / wordCards.length);
        }
        else if (this.currentProficiency === 'danger') {
            // Add explanation for danger
            const infoElement = document.createElement('div');
            infoElement.className = 'game-info';
            infoElement.innerHTML = '<p>Match words and meanings in the same category. Categories can match with words or meanings!</p>';
            board.before(infoElement);
            
            // For danger level, we're matching each card with each other card in the same group
            const categoryGroups = {};
            cards.forEach(card => {
                if (!categoryGroups[card.matchGroup]) {
                    categoryGroups[card.matchGroup] = [];
                }
                categoryGroups[card.matchGroup].push(card);
            });
            
            // Calculate matches: each card can match with every other card of a different type
            let totalMatches = 0;
            Object.values(categoryGroups).forEach(group => {
                const words = group.filter(card => card.isWord).length;
                const meanings = group.filter(card => card.isMeaning).length;
                const categories = group.filter(card => card.isCategory).length;
                
                totalMatches += words * meanings + words * categories + meanings * categories;
            });
            
            cardCount = totalMatches / 2; // Divide by 2 since each match is counted twice
        }
        
        // Display cards
        this.ui.displayCards(cards, board, this.currentProficiency, this.currentDifficulty);
        
        // Setup click handlers
        document.querySelectorAll('.card').forEach(card => {
            this.gameModes.setupCardHandlers(card, this.currentProficiency);
        });
        
        this.cardPairs = cardCount;
        console.log(`Word-Meaning game setup with ${this.cardPairs} possible matches`);
    }
    
    // Setup for spelling game
    setupSpellingGame() {
        const diffSettings = difficultySettings[this.currentDifficulty];
        
        // Different setups based on proficiency
        if (this.currentProficiency === 'easy') {
            // Create cards for matching words with correct spelling
            const cards = this.cardManager.createSpellingCards(diffSettings.pairsCount);
            const board = this.ui.setupEasyUI(this.currentDifficulty);
            
            // Add explanation
            const infoElement = document.createElement('div');
            infoElement.className = 'game-info';
            infoElement.innerHTML = '<p>Match each word with its correct spelling!</p>';
            board.before(infoElement);
            
            this.ui.displayCards(cards, board, 'easy', this.currentDifficulty);
            document.querySelectorAll('.card').forEach(card => {
                this.gameModes.setupCardHandlers(card, 'easy');
            });
            
            this.cardPairs = diffSettings.pairsCount;
        }
        else if (this.currentProficiency === 'warning') {
            // Create cards for confused words
            const cards = this.cardManager.createConfusedWordsCards(Math.floor(diffSettings.pairsCount/2));
            const board = this.ui.setupEasyUI(this.currentDifficulty);
            
            // Add explanation
            const infoElement = document.createElement('div');
            infoElement.className = 'game-info';
            infoElement.innerHTML = '<p>Match each word with its correct meaning! Be careful with commonly confused words.</p>';
            board.before(infoElement);
            
            this.ui.displayCards(cards, board, 'warning', this.currentDifficulty);
            document.querySelectorAll('.card').forEach(card => {
                this.gameModes.setupCardHandlers(card, 'warning');
            });
            
            this.cardPairs = cards.length / 2;
        }
        else if (this.currentProficiency === 'danger') {
            // Create cards with words, spellings, and meanings
            const cards = this.cardManager.createSpellingWithMeaningCards(Math.floor(diffSettings.pairsCount/3));
            const board = this.ui.setupDangerUI(6);
            
            // Add explanation
            const infoElement = document.createElement('div');
            infoElement.className = 'game-info';
            infoElement.innerHTML = '<p>Match words with their correct spellings and meanings!</p>';
            board.before(infoElement);
            
            this.ui.displayCards(cards, board, 'danger', this.currentDifficulty);
            document.querySelectorAll('.card').forEach(card => {
                this.gameModes.setupCardHandlers(card, 'danger');
            });
            
            // For danger level with 3 cards per group, need to calculate number of possible pairs
            // Formula: n(n-1)/2 where n is number of cards in a group
            const groups = cards.length / 3;
            this.cardPairs = groups * 3; // 3 possible pairs in each group of 3 cards
        }
    }
}

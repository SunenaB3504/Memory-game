// Handles UI updates and DOM manipulation

class UIController {
    constructor() {
        // DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.gameBoardSection2 = document.getElementById('gameBoardSection2');
        this.gameContainer = document.getElementById('gameContainer');
        this.matchesDisplay = document.getElementById('matches');
        this.attemptsDisplay = document.getElementById('attempts');
        this.themeSelect = document.getElementById('theme');
    }
    
    // Reset game container and boards
    resetUI() {
        this.gameBoard.innerHTML = '';
        this.gameBoardSection2.innerHTML = '';
        this.gameBoardSection2.classList.add('hidden');
        this.gameContainer.className = '';
    }
    
    // Update scores display
    updateScore(matches, attempts) {
        this.matchesDisplay.textContent = matches;
        this.attemptsDisplay.textContent = attempts;
    }
    
    // Setup UI for easy level
    setupEasyUI(difficulty) {
        const gridColumns = difficulty === 'hard' ? 6 : 4;
        this.gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
        return this.gameBoard;
    }
    
    // Setup UI for warning level
    setupWarningUI(profSettings) {
        this.gameContainer.classList.add('warning-board');
        this.gameBoardSection2.classList.remove('hidden');
        
        // Create section labels
        const section1Label = document.createElement('div');
        section1Label.className = 'section-label';
        section1Label.textContent = 'Section 1: Match one card from here...';
        this.gameBoard.before(section1Label);
        
        const section2Label = document.createElement('div');
        section2Label.className = 'section-label';
        section2Label.textContent = 'Section 2: ...with two matching cards from here';
        this.gameBoardSection2.before(section2Label);

        // Set classes for styling
        this.gameBoard.classList.add('section1');
        this.gameBoardSection2.classList.add('section2');
        
        // Setup both sections
        this.gameBoard.style = profSettings.gridLayout1;
        this.gameBoardSection2.style = profSettings.gridLayout2;
        
        return {
            section1: this.gameBoard,
            section2: this.gameBoardSection2
        };
    }
    
    // Setup UI for danger level
    setupDangerUI(gridCols) {
        this.gameContainer.classList.add('danger-level');
        this.gameBoard.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        return this.gameBoard;
    }
    
    // Setup UI for multi-name matching
    setupMultiNameUI(difficulty) {
        this.gameContainer.classList.add('multiname-mode');
        
        // Set grid layout
        const gridColumns = difficulty === 'hard' ? 6 : 4;
        this.gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
        
        // Add game info
        const infoElement = document.createElement('div');
        infoElement.className = 'game-info';
        infoElement.innerHTML = '<p>Find all matching emoji and name pairs! Each emoji has TWO correct name matches.</p>';
        this.gameBoard.before(infoElement);
        
        return this.gameBoard;
    }
    
    // Display cards on game board
    displayCards(cards, boardElement, proficiency, currentDifficulty) {
        console.log(`Displaying ${cards.length} cards on board`);
        
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            
            // Add different card sizes based on proficiency and difficulty
            if (proficiency === 'danger' || currentDifficulty === 'hard') {
                cardElement.classList.add('card-small');
            } else if (proficiency === 'easy' || currentDifficulty === 'easy') {
                cardElement.classList.add('card-large');
            }
            
            this.setupCardElement(card, cardElement, proficiency);
            
            cardElement.dataset.index = index;
            cardElement.classList.add('game-card');
            
            boardElement.appendChild(cardElement);
        });
        
        console.log(`Board now contains ${boardElement.children.length} cards`);
        return boardElement;
    }
    
    // Setup individual card element
    setupCardElement(card, cardElement, proficiency) {
        // Special handling for number arithmetic cards
        if (typeof card === 'object' && card.type === 'number' || card.type === 'operator') {
            cardElement.dataset.matchGroup = card.matchGroup;
            cardElement.dataset.value = card.value;
            cardElement.dataset.matchOp = card.matchOp || '';
            
            // Set data attributes for matching logic
            cardElement.dataset.isSum = String(card.isSum || false);
            cardElement.dataset.isAddend = String(card.isAddend || false);
            cardElement.dataset.isProduct = String(card.isProduct || false);
            cardElement.dataset.isFactor = String(card.isFactor || false);
            cardElement.dataset.isResult = String(card.isResult || false);
            cardElement.dataset.isOperand = String(card.isOperand || false);
            cardElement.dataset.isOperator = String(card.isOperator || false);
            
            if (card.type === 'operator') {
                cardElement.classList.add('operator-card');
            } else {
                cardElement.classList.add('number-card');
            }
            
            // Display the card content
            cardElement.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${card.display}</div>
            `;
            
            cardElement.dataset.cardType = proficiency;
            return cardElement;
        }
        
        // Handle multi-name cards
        if (typeof card === 'object' && card.matchGroup && (card.isEmoji !== undefined || card.isName !== undefined)) {
            cardElement.dataset.matchGroup = card.matchGroup;
            cardElement.dataset.value = card.id;
            // Convert boolean values to strings for data attributes
            cardElement.dataset.isEmoji = String(card.isEmoji);
            cardElement.dataset.isName = String(card.isName);
            
            if (card.type === 'text') {
                cardElement.classList.add('text-card');
                
                if (this.themeSelect.value === 'emojiToMultipleHindi') {
                    cardElement.classList.add('hindi-text');
                }
            }
            
            cardElement.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${card.display}</div>
            `;
            
            cardElement.dataset.cardType = 'multiname';
        } 
        // Handle match-group cards (warning/danger)
        else if (typeof card === 'object' && card.matchGroup !== undefined) {
            cardElement.dataset.matchGroup = card.matchGroup;
            cardElement.classList.add(`match-group-${card.matchGroup}`);
            
            cardElement.dataset.value = card.id;
            
            if (card.type === 'text') {
                cardElement.classList.add('text-card');
                
                if (this.themeSelect.value === 'emojiToHindi') {
                    cardElement.classList.add('hindi-text');
                }
            }
            
            cardElement.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${card.display}</div>
            `;
            
            cardElement.dataset.cardType = proficiency;
        } 
        // Handle emoji-to-name cards
        else if (typeof card === 'object' && card.id) {
            cardElement.dataset.value = card.id;
            
            if (card.type === 'text') {
                cardElement.classList.add('text-card');
                
                if (this.themeSelect.value === 'emojiToHindi') {
                    cardElement.classList.add('hindi-text');
                }
            }
            
            cardElement.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${card.display}</div>
            `;
            
            cardElement.dataset.cardType = 'emoji-name';
        } 
        // Regular theme cards
        else {
            cardElement.dataset.value = card;
            
            const textBasedThemes = ['englishWords', 'numbers', 'hindiAlphabets', 'hindiWords'];
            if (textBasedThemes.includes(this.themeSelect.value)) {
                cardElement.classList.add('text-card');
            }
            
            cardElement.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${card}</div>
            `;
            
            cardElement.dataset.cardType = 'standard';
        }
        
        return cardElement;
    }
}

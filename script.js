document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const gameBoardSection2 = document.getElementById('gameBoardSection2');
    const gameContainer = document.getElementById('gameContainer');
    const matchesDisplay = document.getElementById('matches');
    const attemptsDisplay = document.getElementById('attempts');
    const startButton = document.getElementById('startGame');
    const themeSelect = document.getElementById('theme');
    const proficiencySelect = document.getElementById('proficiency');
    const difficultySelect = document.getElementById('difficulty');

    let firstCard = null;
    let secondCard = null;
    let thirdCard = null;  // For Warning level where we match three cards
    let lockBoard = false;
    let matches = 0;
    let attempts = 0;
    let cardPairs = 0;
    let currentProficiency = 'easy';
    let currentDifficulty = 'medium';
    let matchGroups = [];  // For Warning and Danger levels

    const themes = {
        animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸'],
        cartoon: ['🤖', '👾', '👽', '👻', '🧠', '👑', '🧸', '🎮', '🎯', '🎨', '🧩', '🎭'],
        fashion: ['👓', '👕', '👖', '🧣', '🧤', '👗', '👘', '👙', '👚', '👛', '👜', '👝'],
        englishWords: ['Sun', 'Cat', 'Dog', 'Sky', 'Run', 'Sea', 'Hat', 'Jam', 'Cup', 'Book', 'Pen', 'Fish'],
        numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        hindiAlphabets: ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ'],
        hindiWords: ['नमस्ते', 'धन्यवाद', 'प्यार', 'दोस्त', 'खुशी', 'आशा', 'जीवन', 'खेल', 'आकाश', 'समय', 'फूल', 'पानी'],
        emojiToEnglish: [
            { emoji: '🍎', name: 'Apple' },
            { emoji: '🚗', name: 'Car' },
            { emoji: '🐘', name: 'Elephant' },
            { emoji: '🏠', name: 'House' },
            { emoji: '🐵', name: 'Monkey' },
            { emoji: '🌧️', name: 'Rain' },
            { emoji: '⭐', name: 'Star' },
            { emoji: '🌞', name: 'Sun' },
            { emoji: '🐅', name: 'Tiger' },
            { emoji: '🌊', name: 'Water' },
            { emoji: '🌲', name: 'Tree' },
            { emoji: '📱', name: 'Phone' }
        ],
        emojiToHindi: [
            { emoji: '🍎', name: 'सेब' },
            { emoji: '🚗', name: 'गाड़ी' },
            { emoji: '🐘', name: 'हाथी' },
            { emoji: '🏠', name: 'घर' },
            { emoji: '🐵', name: 'बंदर' },
            { emoji: '🌧️', name: 'बारिश' },
            { emoji: '⭐', name: 'तारा' },
            { emoji: '🌞', name: 'सूरज' },
            { emoji: '🐅', name: 'बाघ' },
            { emoji: '🌊', name: 'पानी' },
            { emoji: '🌲', name: 'पेड़' },
            { emoji: '📱', name: 'फोन' }
        ]
    };

    // Difficulty settings (number of pairs for each level)
    const difficultySettings = {
        easy: {
            pairsCount: 4,     // 8 cards total
            gridLayout: 'grid-template-columns: repeat(4, 1fr)'
        },
        medium: {
            pairsCount: 8,     // 16 cards total
            gridLayout: 'grid-template-columns: repeat(4, 1fr)'
        },
        hard: {
            pairsCount: 12,    // 24 cards total
            gridLayout: 'grid-template-columns: repeat(6, 1fr)'
        }
    };

    // Proficiency settings (different matching mechanics)
    const proficiencySettings = {
        easy: {
            // Standard matching with pairs
            cardMultiplier: 2  // Each pair has 2 cards
        },
        warning: {
            // Match one card from section 1 with two cards from section 2
            section1Ratio: 1,   // 1 part for section 1
            section2Ratio: 2,   // 2 parts for section 2
            gridLayout1: 'grid-template-columns: repeat(4, 1fr)',
            gridLayout2: 'grid-template-columns: repeat(4, 1fr)'
        },
        danger: {
            // Complex matching with three cards per group
            cardMultiplier: 3,  // Each group has 3 cards
            gridAdjustment: 6   // Force wider grid for danger level
        }
    };

    startButton.addEventListener('click', startGame);

    function startGame() {
        console.log("Starting game...");
        resetGame();
        const theme = themeSelect.value;
        currentProficiency = proficiencySelect.value;
        currentDifficulty = difficultySelect.value;
        
        console.log(`Theme: ${theme}, Proficiency: ${currentProficiency}, Difficulty: ${currentDifficulty}`);
        
        switch(currentProficiency) {
            case 'easy':
                setupEasyLevel(theme, currentDifficulty);
                break;
            case 'warning':
                setupWarningLevel(theme, currentDifficulty);
                break;
            case 'danger':
                setupDangerLevel(theme, currentDifficulty);
                break;
        }
    }

    function resetGame() {
        gameBoard.innerHTML = '';
        gameBoardSection2.innerHTML = '';
        gameBoardSection2.classList.add('hidden');
        gameContainer.className = '';
        
        firstCard = null;
        secondCard = null;
        thirdCard = null;
        lockBoard = false;
        matches = 0;
        attempts = 0;
        matchGroups = [];
        updateScore();
    }

    function setupEasyLevel(theme, difficulty) {
        const diffSettings = difficultySettings[difficulty];
        console.log(`Setting up Easy level with ${diffSettings.pairsCount} pairs...`);
        
        // Standard game setup
        const cards = createStandardCards(theme, diffSettings.pairsCount);
        console.log(`Created ${cards.length} cards`);
        
        // Determine grid layout based on difficulty
        const gridColumns = difficulty === 'hard' ? 6 : 4;
        gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
        
        displayCards(cards, gameBoard, 'easy');
        
        cardPairs = diffSettings.pairsCount;
        console.log(`Game board ready with ${cardPairs} pairs to match`);
    }

    function setupWarningLevel(theme, difficulty) {
        gameContainer.classList.add('warning-board');
        gameBoardSection2.classList.remove('hidden');
        
        const diffSettings = difficultySettings[difficulty];
        const profSettings = proficiencySettings.warning;
        
        // Adjust pair counts for warning level
        // Section 1 gets 1/3 of the pairs, Section 2 gets 2/3 with duplicates
        const totalParts = profSettings.section1Ratio + profSettings.section2Ratio;
        const section1Count = Math.floor(diffSettings.pairsCount * profSettings.section1Ratio / totalParts);
        
        // Create section labels
        const section1Label = document.createElement('div');
        section1Label.className = 'section-label';
        section1Label.textContent = 'Section 1: Match one card from here...';
        gameBoard.before(section1Label);
        
        const section2Label = document.createElement('div');
        section2Label.className = 'section-label';
        section2Label.textContent = 'Section 2: ...with two matching cards from here';
        gameBoardSection2.before(section2Label);

        // Set classes for styling
        gameBoard.classList.add('section1');
        gameBoardSection2.classList.add('section2');

        // Create 1-to-2 matching sets
        const { section1Cards, section2Cards } = createWarningLevelCards(theme, section1Count);
        
        // Setup both sections
        gameBoard.style = profSettings.gridLayout1;
        gameBoardSection2.style = profSettings.gridLayout2;
        
        displayCards(section1Cards, gameBoard, 'warning');
        displayCards(section2Cards, gameBoardSection2, 'warning');
        
        cardPairs = section1Count; // Number of completed matches needed
    }

    function setupDangerLevel(theme, difficulty) {
        gameContainer.classList.add('danger-level');
        
        const diffSettings = difficultySettings[difficulty];
        const profSettings = proficiencySettings.danger;
        
        // Adjust the number of match groups based on difficulty level
        // For danger level, we use fewer groups since each group has 3 cards
        const groupsCount = Math.floor(diffSettings.pairsCount / 2);
        
        // Create complex matching groups (cards in groups of 3)
        const cards = createDangerLevelCards(theme, groupsCount);
        
        // Use a wider grid layout for danger level
        const gridCols = profSettings.gridAdjustment;
        gameBoard.style = `grid-template-columns: repeat(${gridCols}, 1fr)`;
        
        displayCards(cards, gameBoard, 'danger');
        
        cardPairs = groupsCount; // Number of complete groups
    }

    function createStandardCards(theme, pairsCount) {
        // Existing card creation logic for standard (easy) mode
        if (theme === 'emojiToEnglish' || theme === 'emojiToHindi') {
            // ...existing code for emoji-text pairs...
        }
        
        const selectedImages = [...themes[theme]]
            .sort(() => 0.5 - Math.random())
            .slice(0, pairsCount);
        
        const cardPairsArray = [...selectedImages, ...selectedImages];
        
        return cardPairsArray.sort(() => 0.5 - Math.random());
    }

    function createWarningLevelCards(theme, section1Count) {
        const settings = proficiencySettings.warning;
        
        // Select items from theme
        let themeItems = [];
        
        if (theme === 'emojiToEnglish' || theme === 'emojiToHindi') {
            themeItems = [...themes[theme]];
        } else {
            themeItems = [...themes[theme]].map(item => ({ value: item }));
        }
        
        // Shuffle and select items for section 1
        const selectedItems = themeItems
            .sort(() => 0.5 - Math.random())
            .slice(0, section1Count);
            
        // Create section1 cards (one card per match group)
        const section1Cards = selectedItems.map((item, index) => {
            const baseItem = item.emoji || item.value || item;
            return {
                id: `group-${index}`,
                display: baseItem,
                type: typeof baseItem === 'string' && baseItem.length > 1 ? 'text' : 'emoji',
                matchGroup: index
            };
        });
        
        // Create section2 cards (two cards per match group)
        const section2Cards = [];
        selectedItems.forEach((item, index) => {
            // Add two cards for each item
            const baseItem = item.emoji || item.value || item;
            const nameItem = item.name || baseItem;
            
            // First card - same as section1
            section2Cards.push({
                id: `group-${index}-1`,
                display: baseItem,
                type: typeof baseItem === 'string' && baseItem.length > 1 ? 'text' : 'emoji',
                matchGroup: index
            });
            
            // Second card - if we have a name property, use it, otherwise duplicate
            section2Cards.push({
                id: `group-${index}-2`,
                display: nameItem,
                type: typeof nameItem === 'string' && nameItem.length > 1 ? 'text' : 'emoji',
                matchGroup: index
            });
        });
        
        return {
            section1Cards: section1Cards.sort(() => 0.5 - Math.random()),
            section2Cards: section2Cards.sort(() => 0.5 - Math.random())
        };
    }

    function createDangerLevelCards(theme, groupsCount) {
        const settings = proficiencySettings.danger;
        
        // Select items from theme
        let themeItems = [];
        
        if (theme === 'emojiToEnglish' || theme === 'emojiToHindi') {
            themeItems = [...themes[theme]];
        } else {
            themeItems = [...themes[theme]].map(item => ({ value: item }));
        }
        
        // Shuffle and select items
        const selectedItems = themeItems
            .sort(() => 0.5 - Math.random())
            .slice(0, groupsCount);
            
        // Create three cards per match group
        const cards = [];
        const matchGroupLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        selectedItems.forEach((item, index) => {
            const baseItem = item.emoji || item.value || item;
            const nameItem = item.name || baseItem;
            const matchGroup = matchGroupLabels[index];
            
            // Create three variants for each match group
            cards.push({
                id: `group-${matchGroup}-1`,
                display: baseItem,
                type: typeof baseItem === 'string' && baseItem.length > 1 ? 'text' : 'emoji',
                matchGroup: matchGroup,
                matched: false
            });
            
            cards.push({
                id: `group-${matchGroup}-2`,
                display: nameItem,
                type: typeof nameItem === 'string' && nameItem.length > 1 ? 'text' : 'emoji',
                matchGroup: matchGroup,
                matched: false
            });
            
            // Third card is a different variant or duplicate if no variants available
            const thirdDisplay = typeof baseItem === 'string' ? baseItem.toUpperCase() : baseItem;
            cards.push({
                id: `group-${matchGroup}-3`,
                display: thirdDisplay,
                type: typeof thirdDisplay === 'string' && thirdDisplay.length > 1 ? 'text' : 'emoji',
                matchGroup: matchGroup,
                matched: false
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }

    function displayCards(cards, boardElement, proficiency) {
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
            
            // For Warning and Danger levels, handle match groups
            if (typeof card === 'object' && card.matchGroup !== undefined) {
                cardElement.dataset.matchGroup = card.matchGroup;
                cardElement.classList.add(`match-group-${card.matchGroup}`);
                
                // Use match group ID for the data value (for matching)
                cardElement.dataset.value = card.id;
                
                // Apply styling for text cards
                if (card.type === 'text') {
                    cardElement.classList.add('text-card');
                    
                    // Additional styling for Hindi
                    if (themeSelect.value === 'emojiToHindi') {
                        cardElement.classList.add('hindi-text');
                    }
                }
                
                cardElement.innerHTML = `
                    <div class="card-back">?</div>
                    <div class="card-front">${card.display}</div>
                `;
                
            } else if (typeof card === 'object' && card.id) {
                // Original emoji-to-name matching cards
                cardElement.dataset.value = card.id;
                
                if (card.type === 'text') {
                    cardElement.classList.add('text-card');
                    
                    if (themeSelect.value === 'emojiToHindi') {
                        cardElement.classList.add('hindi-text');
                    }
                }
                
                cardElement.innerHTML = `
                    <div class="card-back">?</div>
                    <div class="card-front">${card.display}</div>
                `;
            } else {
                // Regular theme cards
                cardElement.dataset.value = card;
                
                const textBasedThemes = ['englishWords', 'numbers', 'hindiAlphabets', 'hindiWords'];
                if (textBasedThemes.includes(themeSelect.value)) {
                    cardElement.classList.add('text-card');
                }
                
                cardElement.innerHTML = `
                    <div class="card-back">?</div>
                    <div class="card-front">${card}</div>
                `;
            }
            
            cardElement.dataset.index = index;
            
            // Set up different click handlers based on proficiency level
            if (proficiency === 'warning') {
                cardElement.addEventListener('click', flipCardWarning);
            } else if (proficiency === 'danger') {
                cardElement.addEventListener('click', flipCardDanger);
            } else {
                cardElement.addEventListener('click', flipCardEasy);
            }
            
            // Add a specific class to make debugging easier
            cardElement.classList.add('game-card');
            
            boardElement.appendChild(cardElement);
        });
        
        console.log(`Board now contains ${boardElement.children.length} cards`);
    }

    // Standard (Easy) level card flipping
    function flipCardEasy() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        attempts++;
        updateScore();
        
        checkForMatchEasy();
    }

    // Warning level card flipping (1-to-2 matching)
    function flipCardWarning() {
        if (lockBoard) return;
        if (this === firstCard || this === secondCard) return;

        this.classList.add('flipped');
        
        // Logic for the 1-to-2 matching
        if (!firstCard) {
            firstCard = this;
            return;
        }
        
        if (!secondCard) {
            secondCard = this;
            
            // If first two cards are from different sections, proceed
            const isFirstCardSection1 = firstCard.closest('#gameBoard') !== null;
            const isSecondCardSection1 = secondCard.closest('#gameBoard') !== null;
            
            // If both cards from same section, treat as non-match
            if (isFirstCardSection1 === isSecondCardSection1) {
                attempts++;
                updateScore();
                unflipWarningCards();
                return;
            }
            
            // Check if they have the same match group
            if (firstCard.dataset.matchGroup === secondCard.dataset.matchGroup) {
                // Temporarily mark as potential match
                firstCard.classList.add('card-pending-match');
                secondCard.classList.add('card-pending-match');
            } else {
                // Not a match, reset
                attempts++;
                updateScore();
                unflipWarningCards();
            }
            return;
        }
        
        // Third card flipped
        thirdCard = this;
        attempts++;
        updateScore();
        
        // Check if all three cards have the same match group
        const matchGroup1 = firstCard.dataset.matchGroup;
        const matchGroup2 = secondCard.dataset.matchGroup;
        const matchGroup3 = thirdCard.dataset.matchGroup;
        
        if (matchGroup1 === matchGroup2 && matchGroup2 === matchGroup3) {
            // Complete match
            disableWarningCards();
            matches++;
            updateScore();
            
            if (matches === cardPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${attempts} attempts.`);
                }, 500);
            }
        } else {
            // Not a complete match
            unflipWarningCards();
        }
    }
    
    // Danger level card flipping (complex matching)
    function flipCardDanger() {
        if (lockBoard) return;
        if (this === firstCard || this === secondCard) return;
        if (this.classList.contains('matched')) return;

        this.classList.add('flipped');
        
        const currentMatchGroup = this.dataset.matchGroup;
        
        // Start new match group or add to existing
        if (!matchGroups[currentMatchGroup]) {
            matchGroups[currentMatchGroup] = [this];
            return;
        }
        
        // Add to existing match group
        matchGroups[currentMatchGroup].push(this);
        
        // Check if we've selected all cards in this group (3 cards)
        if (matchGroups[currentMatchGroup].length === 3) {
            attempts++;
            updateScore();
            
            // Mark all cards in the group as matched
            matchGroups[currentMatchGroup].forEach(card => {
                card.classList.add('matched');
                card.removeEventListener('click', flipCardDanger);
            });
            
            matches++;
            updateScore();
            
            if (matches === cardPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${attempts} attempts.`);
                }, 500);
            }
            
            // Reset this match group
            matchGroups[currentMatchGroup] = [];
        }
    }

    function checkForMatchEasy() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;

        if (isMatch) {
            disableCards();
            matches++;
            updateScore();
            
            if (matches === cardPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${attempts} attempts.`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCardEasy);
        secondCard.removeEventListener('click', flipCardEasy);
        
        resetBoardState();
    }

    function disableWarningCards() {
        firstCard.classList.remove('card-pending-match');
        secondCard.classList.remove('card-pending-match');
        
        firstCard.classList.add('card-complete-match');
        secondCard.classList.add('card-complete-match');
        thirdCard.classList.add('card-complete-match');
        
        firstCard.removeEventListener('click', flipCardWarning);
        secondCard.removeEventListener('click', flipCardWarning);
        thirdCard.removeEventListener('click', flipCardWarning);
        
        resetWarningBoardState();
    }

    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoardState();
        }, 1000);
    }

    function unflipWarningCards() {
        lockBoard = true;
        
        setTimeout(() => {
            if (firstCard) firstCard.classList.remove('flipped', 'card-pending-match');
            if (secondCard) secondCard.classList.remove('flipped', 'card-pending-match');
            if (thirdCard) thirdCard.classList.remove('flipped');
            resetWarningBoardState();
        }, 1000);
    }

    function resetBoardState() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function resetWarningBoardState() {
        [firstCard, secondCard, thirdCard] = [null, null, null];
        lockBoard = false;
    }

    function updateScore() {
        matchesDisplay.textContent = matches;
        attemptsDisplay.textContent = attempts;
    }
});
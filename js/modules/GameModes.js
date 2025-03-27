// Handles different game modes and matching logic

class GameModes {
    constructor(gameController) {
        this.gameController = gameController;
        
        // Store event handler references for proper removal
        this.eventHandlers = new Map();
    }
    
    // Setup card click handlers based on mode
    setupCardHandlers(cardElement, mode) {
        // Create handler and store reference for later removal
        let handler;
        
        switch (mode) {
            case 'easy':
                handler = (e) => this.flipCardEasy(e.currentTarget);
                cardElement.addEventListener('click', handler);
                break;
            case 'warning':
                handler = (e) => this.flipCardWarning(e.currentTarget);
                cardElement.addEventListener('click', handler);
                break;
            case 'danger':
                handler = (e) => this.flipCardDanger(e.currentTarget);
                cardElement.addEventListener('click', handler);
                break;
            case 'multiname':
                handler = (e) => this.flipCardMultiName(e.currentTarget);
                cardElement.addEventListener('click', handler);
                break;
        }
        
        // Store reference to handler for this card
        this.eventHandlers.set(cardElement, { mode, handler });
    }
    
    // Standard (Easy) level card flipping
    flipCardEasy(card) {
        if (this.gameController.lockBoard || card === this.gameController.firstCard) return;
        if (card.classList.contains('matched')) return;

        // Play click sound when flipping a card
        if (window.soundManager) {
            window.soundManager.play('click');
        }

        card.classList.add('flipped');

        if (!this.gameController.firstCard) {
            this.gameController.firstCard = card;
            return;
        }

        this.gameController.secondCard = card;
        this.gameController.attempts++;
        this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
        
        this.checkForMatchEasy();
    }
    
    // Warning level card flipping (1-to-2 matching)
    flipCardWarning(card) {
        if (this.gameController.lockBoard) return;
        if (card === this.gameController.firstCard || card === this.gameController.secondCard) return;

        // Play click sound
        if (window.soundManager) {
            window.soundManager.play('click');
        }

        card.classList.add('flipped');
        
        // Logic for the 1-to-2 matching
        if (!this.gameController.firstCard) {
            this.gameController.firstCard = card;
            return;
        }
        
        if (!this.gameController.secondCard) {
            this.gameController.secondCard = card;
            
            // If first two cards are from different sections, proceed
            const isFirstCardSection1 = this.gameController.firstCard.closest('#gameBoard') !== null;
            const isSecondCardSection1 = this.gameController.secondCard.closest('#gameBoard') !== null;
            
            // If both cards from same section, treat as non-match
            if (isFirstCardSection1 === isSecondCardSection1) {
                this.gameController.attempts++;
                this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
                this.unflipWarningCards();
                return;
            }
            
            // Check if they have the same match group
            if (this.gameController.firstCard.dataset.matchGroup === this.gameController.secondCard.dataset.matchGroup) {
                // Temporarily mark as potential match
                this.gameController.firstCard.classList.add('card-pending-match');
                this.gameController.secondCard.classList.add('card-pending-match');
            } else {
                // Not a match, reset
                this.gameController.attempts++;
                this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
                this.unflipWarningCards();
            }
            return;
        }
        
        // Third card flipped
        this.gameController.thirdCard = card;
        this.gameController.attempts++;
        this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
        
        // Check if all three cards have the same match group
        const matchGroup1 = this.gameController.firstCard.dataset.matchGroup;
        const matchGroup2 = this.gameController.secondCard.dataset.matchGroup;
        const matchGroup3 = this.gameController.thirdCard.dataset.matchGroup;
        
        if (matchGroup1 === matchGroup2 && matchGroup2 === matchGroup3) {
            // Complete match
            this.disableWarningCards();
            this.gameController.matches++;
            this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
        } else {
            // Not a complete match
            this.unflipWarningCards();
        }
    }
    
    // Danger level card flipping (complex matching)
    flipCardDanger(card) {
        if (this.gameController.lockBoard) return;
        if (card === this.gameController.firstCard || card === this.gameController.secondCard) return;
        if (card.classList.contains('matched')) return;

        // Play click sound
        if (window.soundManager) {
            window.soundManager.play('click');
        }

        card.classList.add('flipped');
        
        const theme = this.gameController.themeSelect.value;
        const isWordTheme = theme === 'englishWords' || theme === 'hindiWords';
        const isSpellingTheme = theme === 'englishSpellings';
        
        // Special handling for word themes
        if (isWordTheme) {
            if (!this.gameController.firstCard) {
                this.gameController.firstCard = card;
                return;
            }
            
            this.gameController.secondCard = card;
            this.gameController.attempts++;
            this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
            
            // Check if it's a match
            if (this.checkWordMeaningMatch(this.gameController.firstCard, this.gameController.secondCard)) {
                // It's a match
                this.gameController.firstCard.classList.add('matched');
                this.gameController.secondCard.classList.add('matched');
                
                this.removeCardHandlers(this.gameController.firstCard, 'danger');
                this.removeCardHandlers(this.gameController.secondCard, 'danger');
                
                this.gameController.matches++;
                this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
                
                this.resetBoardState();
            } else {
                // Not a match
                this.unflipCards();
            }
            
            return;
        }
        
        // Special handling for spelling themes
        if (isSpellingTheme) {
            if (!this.gameController.firstCard) {
                this.gameController.firstCard = card;
                return;
            }
            
            this.gameController.secondCard = card;
            this.gameController.attempts++;
            this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
            
            // Check if it's a match
            if (this.checkSpellingMatch(this.gameController.firstCard, this.gameController.secondCard)) {
                // It's a match
                this.gameController.firstCard.classList.add('matched');
                this.gameController.secondCard.classList.add('matched');
                
                this.removeCardHandlers(this.gameController.firstCard, 'danger');
                this.removeCardHandlers(this.gameController.secondCard, 'danger');
                
                this.gameController.matches++;
                this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
                
                this.resetBoardState();
            } else {
                // Not a match
                this.unflipCards();
            }
            
            return;
        }
        
        // Special handling for numbers theme
        const isNumberTheme = theme === 'numbers';
        
        if (isNumberTheme) {
            const currentMatchGroup = card.dataset.matchGroup;
            
            // If this is the first card in this match group
            if (!this.gameController.matchGroups[currentMatchGroup]) {
                this.gameController.matchGroups[currentMatchGroup] = [card];
                return;
            }
            
            // If it's the second card
            if (this.gameController.matchGroups[currentMatchGroup].length === 1) {
                this.gameController.matchGroups[currentMatchGroup].push(card);
                return;
            }
            
            // If it's the third card
            if (this.gameController.matchGroups[currentMatchGroup].length === 2) {
                this.gameController.matchGroups[currentMatchGroup].push(card);
                
                // Check if it's a valid arithmetic match
                const card1 = this.gameController.matchGroups[currentMatchGroup][0];
                const card2 = this.gameController.matchGroups[currentMatchGroup][1];
                const card3 = card;
                
                // Count as an attempt
                this.gameController.attempts++;
                this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
                
                // Check if it's a valid arithmetic match
                if (this.checkNumberMatch(card1, card2, card3)) {
                    // Handle a match
                    [card1, card2, card3].forEach(c => {
                        c.classList.add('matched');
                        c.removeEventListener('click', (e) => this.flipCardDanger(e.currentTarget));
                    });
                    
                    this.gameController.matches++;
                    this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
                } else {
                    // Not a match, unflip them
                    setTimeout(() => {
                        [card1, card2, card3].forEach(c => c.classList.remove('flipped'));
                        this.gameController.matchGroups[currentMatchGroup] = [];
                    }, 1000);
                }
            }
            
            return;
        }
        
        // Regular danger level logic for non-number themes
        const currentMatchGroup = card.dataset.matchGroup;
        
        // Start new match group or add to existing
        if (!this.gameController.matchGroups[currentMatchGroup]) {
            this.gameController.matchGroups[currentMatchGroup] = [card];
            return;
        }
        
        // Add to existing match group
        this.gameController.matchGroups[currentMatchGroup].push(card);
        
        // Check if we've selected all cards in this group (3 cards)
        if (this.gameController.matchGroups[currentMatchGroup].length === 3) {
            this.gameController.attempts++;
            this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
            
            // Mark all cards in the group as matched
            this.gameController.matchGroups[currentMatchGroup].forEach(card => {
                card.classList.add('matched');
                this.removeCardHandlers(card, 'danger');
            });
            
            this.gameController.matches++;
            this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
            
            // Reset this match group
            this.gameController.matchGroups[currentMatchGroup] = [];
        }
    }
    
    // Multi-name card flipping
    flipCardMultiName(card) {
        if (this.gameController.lockBoard) return;
        if (card === this.gameController.firstCard) return;
        if (card.classList.contains('matched')) return;

        // Play click sound
        if (window.soundManager) {
            window.soundManager.play('click');
        }

        card.classList.add('flipped');
        
        // Debug
        console.log(`Card flipped: ${card.dataset.value}, isEmoji: ${card.dataset.isEmoji}, isName: ${card.dataset.isName}`);

        if (!this.gameController.firstCard) {
            this.gameController.firstCard = card;
            return;
        }

        this.gameController.secondCard = card;
        this.gameController.attempts++;
        this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
        
        // Check for match
        this.checkForMultiNameMatch();
    }
    
    // Check for match in easy mode
    checkForMatchEasy() {
        const theme = this.gameController.themeSelect.value;
        const isNumberTheme = theme === 'numbers';
        const isWordTheme = theme === 'englishWords' || theme === 'hindiWords';
        const isSpellingTheme = theme === 'englishSpellings';
        
        // Check for word-meaning matches
        if (isWordTheme) {
            const isMatch = this.checkWordMeaningMatch(
                this.gameController.firstCard, 
                this.gameController.secondCard
            );
            
            if (isMatch) {
                this.disableCards();
                // Play correct sound
                if (window.soundManager) {
                    window.soundManager.play('correct');
                }
            } else {
                this.unflipCards();
                // Play incorrect sound
                if (window.soundManager) {
                    window.soundManager.play('incorrect');
                }
            }
            return;
        }
        
        // Check for number matches
        if (isNumberTheme) {
            const isMatch = this.checkNumberMatch(
                this.gameController.firstCard, 
                this.gameController.secondCard
            );
            
            if (isMatch) {
                this.disableCards();
                // Play correct sound
                if (window.soundManager) {
                    window.soundManager.play('correct');
                }
            } else {
                this.unflipCards();
                // Play incorrect sound
                if (window.soundManager) {
                    window.soundManager.play('incorrect');
                }
            }
            return;
        }
        
        // Check for spelling matches
        if (isSpellingTheme) {
            const isMatch = this.checkSpellingMatch(
                this.gameController.firstCard, 
                this.gameController.secondCard
            );
            
            if (isMatch) {
                this.disableCards();
                // Play correct sound
                if (window.soundManager) {
                    window.soundManager.play('correct');
                }
            } else {
                this.unflipCards();
                // Play incorrect sound
                if (window.soundManager) {
                    window.soundManager.play('incorrect');
                }
            }
            return;
        }
        
        // Default non-number matching logic
        const isMatch = this.gameController.firstCard.dataset.value === this.gameController.secondCard.dataset.value;

        if (isMatch) {
            this.disableCards();
            // Play correct sound
            if (window.soundManager) {
                window.soundManager.play('correct');
            }
        } else {
            this.unflipCards();
            // Play incorrect sound
            if (window.soundManager) {
                window.soundManager.play('incorrect');
            }
        }
    }
    
    // Check for match in multi-name mode
    checkForMultiNameMatch() {
        console.log("Checking for multi-name match");
        console.log(`First card: group=${this.gameController.firstCard.dataset.matchGroup}, isEmoji=${this.gameController.firstCard.dataset.isEmoji}, isName=${this.gameController.firstCard.dataset.isName}`);
        console.log(`Second card: group=${this.gameController.secondCard.dataset.matchGroup}, isEmoji=${this.gameController.secondCard.dataset.isEmoji}, isName=${this.gameController.secondCard.dataset.isName}`);
        
        // Check if cards belong to the same match group
        const sameMatchGroup = this.gameController.firstCard.dataset.matchGroup === this.gameController.secondCard.dataset.matchGroup;
        
        // Check if we have one emoji and one name card (not two emojis or two names)
        const isEmojiNamePair = 
            (this.gameController.firstCard.dataset.isEmoji === "true" && this.gameController.secondCard.dataset.isName === "true") || 
            (this.gameController.firstCard.dataset.isName === "true" && this.gameController.secondCard.dataset.isEmoji === "true");
        
        console.log(`Same match group: ${sameMatchGroup}, Is emoji-name pair: ${isEmojiNamePair}`);
        
        if (sameMatchGroup && isEmojiNamePair) {
            // It's a match!
            console.log("MATCH FOUND!");
            
            // Mark as matched
            this.gameController.firstCard.classList.add('matched');
            this.gameController.secondCard.classList.add('matched');
            
            // Visual indicator for matched pairs
            this.gameController.firstCard.style.borderColor = "#4CAF50";
            this.gameController.secondCard.style.borderColor = "#4CAF50";
            
            this.disableMultiNameCards();
        } else {
            // Not a match
            console.log("NO MATCH");
            this.unflipCards();
        }
    }
    
    // Check for word-meaning matches
    checkWordMeaningMatch(card1, card2) {
        // Check if they're from the same match group
        if (card1.dataset.matchGroup !== card2.dataset.matchGroup) {
            return false;
        }
        
        const proficiency = this.gameController.currentProficiency;
        
        if (proficiency === 'easy' || proficiency === 'warning') {
            // One card must be a word and the other must be a meaning
            const isWordMeaningPair = 
                (card1.dataset.isWord === "true" && card2.dataset.isMeaning === "true") ||
                (card1.dataset.isMeaning === "true" && card2.dataset.isWord === "true");
                
            return isWordMeaningPair;
        }
        else if (proficiency === 'danger') {
            // Cards must be in the same category, and must be different types
            // (word/meaning pairs or category/word or category/meaning)
            const card1Type = card1.dataset.isWord === "true" ? "word" : 
                             (card1.dataset.isMeaning === "true" ? "meaning" : "category");
            const card2Type = card2.dataset.isWord === "true" ? "word" : 
                             (card2.dataset.isMeaning === "true" ? "meaning" : "category");
                             
            return card1Type !== card2Type;
        }
        
        return false;
    }
    
    // Check for spelling matches
    checkSpellingMatch(card1, card2) {
        // Check if they're part of the same match group
        if (card1.dataset.matchGroup !== card2.dataset.matchGroup) {
            return false;
        }
        
        const proficiency = this.gameController.currentProficiency;
        
        // Easy level - just match word with correct spelling
        if (proficiency === 'easy') {
            const isWordSpellingPair = 
                (card1.dataset.isWord === "true" && card2.dataset.isSpelling === "true") ||
                (card1.dataset.isSpelling === "true" && card2.dataset.isWord === "true");
                
            return isWordSpellingPair;
        }
        
        // Warning level - match confused word with its meaning
        else if (proficiency === 'warning') {
            const isWordMeaningPair = 
                (card1.dataset.isWord === "true" && card2.dataset.isMeaning === "true") ||
                (card1.dataset.isMeaning === "true" && card2.dataset.isWord === "true");
                
            return isWordMeaningPair;
        }
        
        // Danger level - match different types (word/spelling/meaning)
        else if (proficiency === 'danger') {
            // Make sure we're matching different types
            const card1Type = this.getCardType(card1);
            const card2Type = this.getCardType(card2);
            
            return card1Type !== card2Type;
        }
        
        return false;
    }
    
    // Helper to determine card type
    getCardType(card) {
        if (card.dataset.isWord === "true") return "word";
        if (card.dataset.isSpelling === "true") return "spelling";
        if (card.dataset.isMeaning === "true") return "meaning";
        return "unknown";
    }
    
    // Remove event handlers - fixed to use stored references
    removeCardHandlers(card, mode) {
        const handlerInfo = this.eventHandlers.get(card);
        if (handlerInfo && handlerInfo.handler) {
            card.removeEventListener('click', handlerInfo.handler);
            this.eventHandlers.delete(card);
        }
    }
    
    // Disable matched cards (easy mode) - improved
    disableCards() {
        this.removeCardHandlers(this.gameController.firstCard, 'easy');
        this.removeCardHandlers(this.gameController.secondCard, 'easy');
        
        // Mark cards as matched
        this.gameController.firstCard.classList.add('matched');
        this.gameController.secondCard.classList.add('matched');
        
        // Award points for match
        this.gameController.handleSuccessfulMatch();
        
        // Play correct sound
        if (window.soundManager) {
            window.soundManager.play('correct');
        }

        this.resetBoardState();
    }
    
    // Disable matched cards (multi-name mode)
    disableMultiNameCards() {
        this.removeCardHandlers(this.gameController.firstCard, 'multiname');
        this.removeCardHandlers(this.gameController.secondCard, 'multiname');
        
        // Award points for match
        this.gameController.handleSuccessfulMatch();
        
        this.resetBoardState();
    }
    
    // Disable matched cards (warning mode)
    disableWarningCards() {
        this.gameController.firstCard.classList.remove('card-pending-match');
        this.gameController.secondCard.classList.remove('card-pending-match');
        
        this.gameController.firstCard.classList.add('card-complete-match');
        this.gameController.secondCard.classList.add('card-complete-match');
        this.gameController.thirdCard.classList.add('card-complete-match');
        
        this.removeCardHandlers(this.gameController.firstCard, 'warning');
        this.removeCardHandlers(this.gameController.secondCard, 'warning');
        this.removeCardHandlers(this.gameController.thirdCard, 'warning');
        
        // Award points for match
        this.gameController.handleSuccessfulMatch();
        
        this.resetWarningBoardState();
    }
    
    // Unflip non-matched cards
    unflipCards() {
        this.gameController.lockBoard = true;
        
        // Play incorrect sound
        if (window.soundManager) {
            window.soundManager.play('incorrect');
        }

        setTimeout(() => {
            this.gameController.firstCard.classList.remove('flipped');
            this.gameController.secondCard.classList.remove('flipped');
            this.resetBoardState();
        }, 1000);
    }
    
    // Unflip cards in warning mode
    unflipWarningCards() {
        this.gameController.lockBoard = true;
        
        setTimeout(() => {
            if (this.gameController.firstCard) this.gameController.firstCard.classList.remove('flipped', 'card-pending-match');
            if (this.gameController.secondCard) this.gameController.secondCard.classList.remove('flipped', 'card-pending-match');
            if (this.gameController.thirdCard) this.gameController.thirdCard.classList.remove('flipped');
            this.resetWarningBoardState();
        }, 1000);
    }
    
    // Reset board state
    resetBoardState() {
        this.gameController.firstCard = null;
        this.gameController.secondCard = null;
        this.gameController.lockBoard = false;
    }
    
    // Reset warning board state
    resetWarningBoardState() {
        this.gameController.firstCard = null;
        this.gameController.secondCard = null;
        this.gameController.thirdCard = null;
        this.gameController.lockBoard = false;
    }
    
    // Add special methods for number arithmetic matching
    checkNumberMatch(card1, card2, card3 = null) {
        const matchOp = card1.dataset.matchOp;
        
        // Check if cards are part of the same match group
        if (card1.dataset.matchGroup !== card2.dataset.matchGroup) {
            return false;
        }
        
        // For danger level (3 cards with any operation)
        if (matchOp && card3) {
            if (card3.dataset.matchGroup !== card1.dataset.matchGroup) {
                return false;
            }
            
            // Collect all cards and find their roles
            const cards = [card1, card2, card3];
            const result = cards.find(c => c.dataset.isResult === "true");
            const operand = cards.find(c => c.dataset.isOperand === "true");
            const operator = cards.find(c => c.dataset.isOperator === "true");
            
            // Ensure we have one of each type
            if (!result || !operand || !operator) {
                return false;
            }
            
            // Actually validate the arithmetic operation
            const resultVal = parseInt(result.dataset.value);
            const operandVal = parseInt(operand.dataset.value);
            const op = operator.dataset.value;
            
            // Extract the operand values based on operation
            let expectedResult;
            switch(op) {
                case '+':
                    // We don't know the other operand, but we can check if result > operand
                    return resultVal > operandVal;
                case '-':
                    // We don't know which operand is which, but result should be positive
                    return resultVal > 0 && operandVal > resultVal;
                case '×':
                    // Result should be a multiple of operand
                    return resultVal % operandVal === 0;
                case '÷':
                    // Result should divide evenly into operand
                    return operandVal % resultVal === 0;
                default:
                    return false;
            }
        }
        
        // For easy level (addition)
        if (matchOp === 'add') {
            // One card must be the sum and one must be an addend
            if ((card1.dataset.isSum === "true" && card2.dataset.isAddend === "true") ||
                (card1.dataset.isAddend === "true" && card2.dataset.isSum === "true")) {
                
                // Actually validate that the numbers add up correctly
                const sum = parseInt(card1.dataset.isSum === "true" ? card1.dataset.value : card2.dataset.value);
                const addend = parseInt(card1.dataset.isAddend === "true" ? card1.dataset.value : card2.dataset.value);
                
                // For addition, we're only checking if addend < sum (since we need two addends)
                return addend < sum;
            }
            return false;
        }
        
        // For warning level (multiplication)
        if (matchOp === 'multiply') {
            // One card must be the product and one must be a factor
            if ((card1.dataset.isProduct === "true" && card2.dataset.isFactor === "true") ||
                (card1.dataset.isFactor === "true" && card2.dataset.isProduct === "true")) {
                
                // Actually validate the multiplication
                const product = parseInt(card1.dataset.isProduct === "true" ? card1.dataset.value : card2.dataset.value);
                const factor = parseInt(card1.dataset.isFactor === "true" ? card1.dataset.value : card2.dataset.value);
                
                // Check if factor divides product evenly
                return product % factor === 0;
            }
            return false;
        }
        
        return false;
    }
}

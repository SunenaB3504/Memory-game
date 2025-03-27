// Handles different game modes and matching logic

class GameModes {
    constructor(gameController) {
        this.gameController = gameController;
    }
    
    // Setup card click handlers based on mode
    setupCardHandlers(cardElement, mode) {
        switch (mode) {
            case 'easy':
                cardElement.addEventListener('click', (e) => this.flipCardEasy(e.currentTarget));
                break;
            case 'warning':
                cardElement.addEventListener('click', (e) => this.flipCardWarning(e.currentTarget));
                break;
            case 'danger':
                cardElement.addEventListener('click', (e) => this.flipCardDanger(e.currentTarget));
                break;
            case 'multiname':
                cardElement.addEventListener('click', (e) => this.flipCardMultiName(e.currentTarget));
                break;
        }
    }
    
    // Standard (Easy) level card flipping
    flipCardEasy(card) {
        if (this.gameController.lockBoard || card === this.gameController.firstCard) return;
        if (card.classList.contains('matched')) return;

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
            
            if (this.gameController.matches === this.gameController.cardPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${this.gameController.attempts} attempts.`);
                }, 500);
            }
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

        card.classList.add('flipped');
        
        // Special handling for numbers theme
        const isNumberTheme = this.gameController.themeSelect.value === 'numbers';
        
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
                    
                    if (this.gameController.matches === this.gameController.cardPairs) {
                        setTimeout(() => {
                            alert(`Congratulations! You completed the game in ${this.gameController.attempts} attempts.`);
                        }, 500);
                    }
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
            
            if (this.gameController.matches === this.gameController.cardPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${this.gameController.attempts} attempts.`);
                }, 500);
            }
            
            // Reset this match group
            this.gameController.matchGroups[currentMatchGroup] = [];
        }
    }
    
    // Multi-name card flipping
    flipCardMultiName(card) {
        if (this.gameController.lockBoard) return;
        if (card === this.gameController.firstCard) return;
        if (card.classList.contains('matched')) return;

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
        const isNumberTheme = this.gameController.themeSelect.value === 'numbers';
        
        if (isNumberTheme) {
            const isMatch = this.checkNumberMatch(
                this.gameController.firstCard, 
                this.gameController.secondCard
            );
            
            if (isMatch) {
                this.disableCards();
                this.gameController.matches++;
                this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
                
                if (this.gameController.matches === this.gameController.cardPairs) {
                    setTimeout(() => {
                        alert(`Congratulations! You completed the game in ${this.gameController.attempts} attempts.`);
                    }, 500);
                }
            } else {
                this.unflipCards();
            }
            return;
        }
        
        // Default non-number matching logic
        const isMatch = this.gameController.firstCard.dataset.value === this.gameController.secondCard.dataset.value;

        if (isMatch) {
            this.disableCards();
            this.gameController.matches++;
            this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
            
            if (this.gameController.matches === this.gameController.cardPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${this.gameController.attempts} attempts.`);
                }, 500);
            }
        } else {
            this.unflipCards();
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
            this.gameController.matches++;
            this.gameController.ui.updateScore(this.gameController.matches, this.gameController.attempts);
            
            if (this.gameController.matches === this.gameController.cardPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${this.gameController.attempts} attempts.`);
                }, 500);
            }
        } else {
            // Not a match
            console.log("NO MATCH");
            this.unflipCards();
        }
    }
    
    // Remove event handlers
    removeCardHandlers(card, mode) {
        switch (mode) {
            case 'easy':
                card.removeEventListener('click', this.flipCardEasy);
                break;
            case 'warning':
                card.removeEventListener('click', this.flipCardWarning);
                break;
            case 'danger':
                card.removeEventListener('click', this.flipCardDanger);
                break;
            case 'multiname':
                card.removeEventListener('click', this.flipCardMultiName);
                break;
        }
    }
    
    // Disable matched cards (easy mode)
    disableCards() {
        this.removeCardHandlers(this.gameController.firstCard, 'easy');
        this.removeCardHandlers(this.gameController.secondCard, 'easy');
        
        this.resetBoardState();
    }
    
    // Disable matched cards (multi-name mode)
    disableMultiNameCards() {
        this.removeCardHandlers(this.gameController.firstCard, 'multiname');
        this.removeCardHandlers(this.gameController.secondCard, 'multiname');
        
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
        
        this.resetWarningBoardState();
    }
    
    // Unflip non-matched cards
    unflipCards() {
        this.gameController.lockBoard = true;
        
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
            
            // Need one result, one operand, and one operator
            const hasResult = [card1, card2, card3].some(card => card.dataset.isResult === "true");
            const hasOperand = [card1, card2, card3].some(card => card.dataset.isOperand === "true");
            const hasOperator = [card1, card2, card3].some(card => card.dataset.isOperator === "true");
            
            return hasResult && hasOperand && hasOperator;
        }
        
        // For easy level (addition)
        if (matchOp === 'add') {
            // One card must be the sum and one must be an addend
            const isAdditionMatch = 
                (card1.dataset.isSum === "true" && card2.dataset.isAddend === "true") ||
                (card1.dataset.isAddend === "true" && card2.dataset.isSum === "true");
                
            return isAdditionMatch;
        }
        
        // For warning level (multiplication)
        if (matchOp === 'multiply') {
            // One card must be the product and one must be a factor
            const isMultiplicationMatch = 
                (card1.dataset.isProduct === "true" && card2.dataset.isFactor === "true") ||
                (card1.dataset.isFactor === "true" && card2.dataset.isProduct === "true");
                
            return isMultiplicationMatch;
        }
        
        return false;
    }
}

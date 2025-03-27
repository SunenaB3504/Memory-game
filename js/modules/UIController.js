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
        
        // Points and achievements UI elements
        this.pointsDisplay = document.getElementById('currentPoints');
        this.totalPointsDisplay = document.getElementById('totalPoints');
        this.levelDisplay = document.getElementById('playerLevel');
        this.levelProgressBar = document.getElementById('levelProgress');
        this.achievementsContainer = document.getElementById('achievements');
        this.rewardMessageContainer = document.getElementById('rewardMessage');
        
        // Active events container
        this.activeEventsContainer = document.getElementById('active-events');
    }
    
    // Reset game container and boards
    resetUI() {
        this.gameBoard.innerHTML = '';
        this.gameBoardSection2.innerHTML = '';
        this.gameBoardSection2.classList.add('hidden');
        this.gameContainer.className = '';
        
        // Clear any existing game info/instructions
        this.clearGameInstructions();
    }
    
    // Add a new method to clear game instructions
    clearGameInstructions() {
        // Remove any existing game-info elements
        const existingInfos = document.querySelectorAll('.game-info');
        existingInfos.forEach(info => info.remove());
    }
    
    // Add a new method to show game instructions
    showGameInstructions(text, board) {
        // First clear any existing instructions
        this.clearGameInstructions();
        
        // Create instruction element with improved styling
        const infoElement = document.createElement('div');
        infoElement.className = 'game-info animate__animated animate__fadeIn';
        infoElement.innerHTML = `<p>${text}</p>`;
        
        // Add enhanced styling
        Object.assign(infoElement.style, {
            background: "linear-gradient(to right, #f8f0ff, #fff4e0)",
            padding: "12px 20px",
            borderRadius: "15px",
            marginBottom: "20px",
            textAlign: "center",
            borderLeft: "5px solid #9c27b0",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: "600",
            fontSize: "16px",
            color: "#7b1fa2"
        });
        
        // Add before the specified board
        if (board) {
            board.before(infoElement);
        }
        
        return infoElement;
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
        // Handle spelling-related cards
        if (typeof card === 'object' && (card.matchType === 'spelling' || card.matchType === 'confused-word' || card.matchType === 'spelling-meaning')) {
            cardElement.dataset.matchGroup = card.matchGroup;
            cardElement.dataset.value = card.id;
            
            // Set data attributes for matching logic
            if (card.isWord !== undefined) {
                cardElement.dataset.isWord = String(card.isWord);
            }
            if (card.isSpelling !== undefined) {
                cardElement.dataset.isSpelling = String(card.isSpelling);
            }
            if (card.isMeaning !== undefined) {
                cardElement.dataset.isMeaning = String(card.isMeaning);
            }
            
            // Apply appropriate styling classes
            if (card.type === 'spelling-word') {
                cardElement.classList.add('word-card');
            } else if (card.isWrong) {
                // Add special styling for wrong spelling
                cardElement.classList.add('wrong-spelling-card');
            }
            
            // Create front and back elements
            const backElement = document.createElement('div');
            backElement.className = 'card-back';
            backElement.textContent = '?';
            
            const frontElement = document.createElement('div');
            frontElement.className = 'card-front';
            
            // Apply blue color to wrong spelling cards
            if (card.isWrong) {
                frontElement.style.color = '#2196F3';  // Blue color for wrong spelling
                frontElement.innerHTML = `${card.display} <small style="display:block;font-size:10px;opacity:0.7;">(incorrect spelling)</small>`;
            } else {
                frontElement.textContent = card.display;
            }
            
            cardElement.appendChild(backElement);
            cardElement.appendChild(frontElement);
            
            cardElement.dataset.cardType = proficiency;
            return cardElement;
        }
        
        // Special handling for word-meaning cards
        if (typeof card === 'object' && card.matchType === 'word-meaning') {
            cardElement.dataset.matchGroup = card.matchGroup;
            cardElement.dataset.value = card.id;
            cardElement.dataset.isWord = String(card.isWord || false);
            cardElement.dataset.isMeaning = String(card.isMeaning || false);
            cardElement.dataset.isCategory = String(card.isCategory || false);
            
            // Style based on card type
            if (card.type === 'word') {
                cardElement.classList.add('word-card');
                
                // Special styling for Hindi words
                if (this.themeSelect.value === 'hindiWords') {
                    cardElement.classList.add('hindi-text');
                }
            } else if (card.type === 'meaning') {
                cardElement.classList.add('meaning-card');
                
                // Special styling for Hindi meanings
                if (this.themeSelect.value === 'hindiWords') {
                    cardElement.classList.add('hindi-text');
                }
            } else if (card.type === 'category') {
                cardElement.classList.add('category-card');
            }
            
            cardElement.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${card.display}</div>
            `;
            
            cardElement.dataset.cardType = proficiency;
            return cardElement;
        }
        
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
        else if (typeof card === 'object' && card.id && card.value) {
            cardElement.dataset.value = card.value;
            
            if (card.type === 'text') {
                cardElement.classList.add('text-card');
                
                if (this.themeSelect.value === 'emojiToHindi') {
                    cardElement.classList.add('hindi-text');
                }
            } else if (card.type === 'emoji') {
                cardElement.classList.add('emoji-card');
            }
            
            const backElement = document.createElement('div');
            backElement.className = 'card-back';
            backElement.textContent = '?';
            
            const frontElement = document.createElement('div');
            frontElement.className = 'card-front';
            frontElement.textContent = card.display;
            
            // Adjust font size for emoji cards
            if (card.type === 'emoji') {
                frontElement.style.fontSize = '40px';
            }
            
            cardElement.appendChild(backElement);
            cardElement.appendChild(frontElement);
            
            cardElement.dataset.cardType = 'standard';
            return cardElement;
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
    
    // Update the points display
    updatePoints(currentPoints, totalPoints = null) {
        if (this.pointsDisplay) {
            this.pointsDisplay.textContent = currentPoints;
        }
        
        if (totalPoints !== null && this.totalPointsDisplay) {
            this.totalPointsDisplay.textContent = totalPoints;
        }
    }
    
    // Update player level display
    updateLevel(levelInfo) {
        if (this.levelDisplay) {
            this.levelDisplay.textContent = levelInfo.level;
        }
        
        if (this.levelProgressBar) {
            this.levelProgressBar.style.width = `${levelInfo.percentage}%`;
            this.levelProgressBar.setAttribute('aria-valuenow', levelInfo.percentage);
            this.levelProgressBar.textContent = `${levelInfo.percentage}%`;
        }
    }
    
    // Display a reward notification
    showRewardMessage(message, type = 'success') {
        if (!this.rewardMessageContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type} reward-message`;
        messageElement.innerHTML = message;
        
        // Add animation classes
        messageElement.classList.add('animate__animated', 'animate__bounceIn');
        
        // Add to container
        this.rewardMessageContainer.appendChild(messageElement);
        
        // Remove after a few seconds
        setTimeout(() => {
            messageElement.classList.replace('animate__bounceIn', 'animate__fadeOut');
            
            // Remove element after animation completes
            setTimeout(() => {
                messageElement.remove();
            }, 800);
        }, 3000);
    }
    
    // Show points earned animation
    showPointsEarned(points, x, y) {
        const pointsElement = document.createElement('div');
        pointsElement.className = 'points-earned animate__animated animate__bounceIn';
        pointsElement.textContent = `+${points}`;
        
        // Position near the matched cards
        pointsElement.style.position = 'absolute';
        pointsElement.style.left = `${x}px`;
        pointsElement.style.top = `${y}px`;
        
        // Add to body
        document.body.appendChild(pointsElement);
        
        // Animate upward and fade out
        setTimeout(() => {
            pointsElement.classList.remove('animate__bounceIn');
            pointsElement.classList.add('animate__fadeOutUp');
            
            // Remove element after animation
            setTimeout(() => {
                pointsElement.remove();
            }, 1000);
        }, 500);
        
        // Add encouragement messages randomly
        if (points > 15 && Math.random() > 0.5) {
            this.showEncouragement(x, y + 40);
        }
    }
    
    // Display game completion summary
    showGameSummary(results) {
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'game-summary animate__animated animate__bounceIn';
        
        let content = `
            <h3>Awesome Job, Nia! 🎉</h3>
            <div class="summary-points">
                <div class="row">
                    <div class="col">Match Points:</div>
                    <div class="col">${results.matchPoints}</div>
                </div>
                <div class="row">
                    <div class="col">Completion Bonus:</div>
                    <div class="col">+${results.completionPoints}</div>
                </div>
                <div class="row total-row">
                    <div class="col">Total Game Points:</div>
                    <div class="col">${results.totalGamePoints}</div>
                </div>
            </div>
        `;
        
        if (results.perfectGame) {
            content += `
                <div class="perfect-game">
                    <span class="badge badge-success">Perfect Game!</span>
                    <p>Wow! You completed the game with minimum possible attempts!</p>
                </div>
            `;
        }
        
        // Check if there's a reward redemption system and we're close to a milestone
        if (window.rewardRedemption) {
            // Find the next unclaimed reward
            const nextReward = window.rewardRedemption.rewardTiers
                .filter(reward => !window.rewardRedemption.claimedRewards.includes(reward.id))
                .sort((a, b) => a.points - b.points)
                .find(reward => reward.points > results.totalPoints);
            
            if (nextReward && nextReward.points - results.totalPoints <= 200) {
                // We're close to a reward milestone, show it in the summary
                content += `
                    <div style="background: #f8f0ff; padding: 15px; border-radius: 15px; margin-top: 15px; text-align: center;">
                        <p>You're getting close to a reward!</p>
                        <div style="font-size: 24px; margin: 5px 0;">${nextReward.icon} ${nextReward.name}</div>
                        <p>Just ${nextReward.points - results.totalPoints} more points to go!</p>
                    </div>
                `;
            }
        }
        
        summaryContainer.innerHTML = content;
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        // Add continue button
        const continueButton = document.createElement('button');
        continueButton.className = 'btn btn-primary mt-3';
        continueButton.textContent = 'Keep Playing!';
        continueButton.onclick = () => {
            modalOverlay.classList.add('fade-out');
            setTimeout(() => {
                modalOverlay.remove();
            }, 500);
        };
        
        summaryContainer.appendChild(continueButton);
        modalOverlay.appendChild(summaryContainer);
        document.body.appendChild(modalOverlay);
        
        // Launch confetti celebration!
        if (window.confetti) {
            window.confetti.createConfetti();
        }
    }
    
    // Update achievements display
    updateAchievements(achievements) {
        if (!this.achievementsContainer) return;
        
        // Clear existing achievements
        this.achievementsContainer.innerHTML = '';
        
        if (achievements.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'text-muted';
            emptyMessage.textContent = 'Complete games to earn achievements!';
            this.achievementsContainer.appendChild(emptyMessage);
            return;
        }
        
        // Create achievement badges
        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.setAttribute('data-toggle', 'tooltip');
            badge.setAttribute('title', achievement.description);
            
            badge.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-points">+${achievement.points}</div>
                </div>
            `;
            
            this.achievementsContainer.appendChild(badge);
        });
        
        // Initialize tooltips if Bootstrap is available
        if (typeof $ !== 'undefined' && $.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
    
    // Show notification for a new achievement
    showAchievementUnlocked(achievement) {
        if (!achievement) return;
        
        const achievementNotification = `
            <div class="achievement-unlocked">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} points</div>
                </div>
            </div>
        `;
        
        this.showRewardMessage(achievementNotification, 'primary');
    }
    
    // Update active events display
    updateActiveEvents(events = []) {
        if (!this.activeEventsContainer) return;
        
        // Clear current events
        this.activeEventsContainer.innerHTML = '';
        
        if (events.length === 0) return;
        
        // Add each active event
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'active-event';
            
            eventElement.innerHTML = `
                <span class="event-icon">🎉</span>
                <span class="event-name">${event.name}</span>
                <span class="multiplier">x${event.pointMultiplier}</span>
            `;
            
            this.activeEventsContainer.appendChild(eventElement);
        });
    }
    
    // Add a new method for showing encouraging messages
    showEncouragement(x, y) {
        const messages = [
            "Great job, Nia! 👍",
            "Awesome! 🤩",
            "You're doing amazing! ⭐",
            "Fantastic match! 🎯",
            "Super smart! 🧠",
            "Keep it up! 🔥",
            "You're a star! 🌟",
            "Incredible! 🎊"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const encourageElement = document.createElement('div');
        encourageElement.className = 'encourage-message animate__animated animate__fadeIn';
        encourageElement.textContent = message;
        encourageElement.style.position = 'absolute';
        encourageElement.style.left = `${x - 50}px`;
        encourageElement.style.top = `${y}px`;
        encourageElement.style.background = 'rgba(156, 39, 176, 0.1)';
        encourageElement.style.padding = '5px 10px';
        encourageElement.style.borderRadius = '10px';
        encourageElement.style.color = '#9c27b0';
        encourageElement.style.fontWeight = 'bold';
        encourageElement.style.zIndex = '100';
        
        document.body.appendChild(encourageElement);
        
        setTimeout(() => {
            encourageElement.classList.remove('animate__fadeIn');
            encourageElement.classList.add('animate__fadeOut');
            
            setTimeout(() => {
                encourageElement.remove();
            }, 1000);
        }, 1500);
    }

    // Show next reward milestone
    showNextRewardMilestone(totalPoints) {
        if (!window.rewardRedemption) return;
        
        // Find the next unclaimed reward
        const nextReward = window.rewardRedemption.rewardTiers
            .filter(reward => !window.rewardRedemption.claimedRewards.includes(reward.id))
            .sort((a, b) => a.points - b.points)
            .find(reward => reward.points > totalPoints);
        
        if (!nextReward) return; // No next reward found
        
        // Create the milestone notification
        const notification = document.createElement('div');
        notification.className = 'next-reward-indicator animate__animated animate__fadeIn';
        
        // Progress percentage
        const lastMilestone = window.rewardRedemption.rewardTiers
            .filter(reward => reward.points < nextReward.points)
            .sort((a, b) => b.points - a.points)[0]?.points || 0;
        
        const progressPercentage = Math.min(100, Math.floor(((totalPoints - lastMilestone) / (nextReward.points - lastMilestone)) * 100));
        const pointsNeeded = nextReward.points - totalPoints;
        
        notification.innerHTML = `
            <div class="next-reward-icon">${nextReward.icon}</div>
            <div class="next-reward-info">
                <div class="next-reward-name">${nextReward.name}</div>
                <div class="next-reward-points">
                    ${pointsNeeded} more points needed!
                </div>
                <div class="next-reward-progress">
                    <div class="next-reward-progress-bar" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
        `;
        
        // Show the notification
        this.showRewardMessage(notification.outerHTML);
    }
}

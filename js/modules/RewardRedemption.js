/**
 * Handles real-world reward redemptions based on game points
 */

class RewardRedemption {
    constructor() {
        // Define available rewards and their point thresholds
        this.rewardTiers = [
            { id: 'lollypop', name: 'Lollipop', points: 500, icon: '🍭', description: 'A sweet treat for reaching 500 points!' },
            { id: 'icecream', name: 'Ice Cream', points: 1000, icon: '🍦', description: 'Cool and delicious ice cream reward' },
            { id: 'burger', name: 'Burger', points: 2000, icon: '🍔', description: 'A tasty burger for your gaming skills' },
            { id: 'chicken', name: 'Fried Chicken', points: 3000, icon: '🍗', description: 'Crispy fried chicken - yum!' },
            { id: 'pizza', name: 'Pizza', points: 4000, icon: '🍕', description: 'A whole pizza just for you!' },
            { id: 'book', name: 'Book', points: 5000, icon: '📚', description: 'Choose any book you like!' },
            { id: 'toy', name: 'Toy', points: 10000, icon: '🧸', description: 'Pick any toy you want!' }
        ];
        
        // Load claimed rewards from storage
        this.claimedRewards = this.loadClaimedRewards();
        
        // Create UI elements
        this.createRewardsButton();
    }
    
    // Load previously claimed rewards from storage
    loadClaimedRewards() {
        try {
            const saved = localStorage.getItem('claimedRewards');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading claimed rewards:', error);
            return [];
        }
    }
    
    // Save claimed rewards to storage
    saveClaimedRewards() {
        try {
            localStorage.setItem('claimedRewards', JSON.stringify(this.claimedRewards));
        } catch (error) {
            console.error('Error saving claimed rewards:', error);
        }
    }
    
    // Create the rewards button in the UI
    createRewardsButton() {
        const button = document.createElement('button');
        button.textContent = "🎁 Claim Rewards";
        button.className = "rewards-button";
        button.addEventListener('click', () => this.showRewardsPanel());
        
        // Style the button to match the game's theme
        Object.assign(button.style, {
            position: "fixed",
            bottom: "75px",
            right: "20px",
            zIndex: "1000",
            padding: "10px 15px",
            background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "'Nunito', sans-serif",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
            border: "2px solid #ffc107"
        });
        
        // Add hover effects
        button.onmouseenter = () => {
            button.style.transform = "translateY(-2px)";
            button.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
        };
        
        button.onmouseleave = () => {
            button.style.transform = "translateY(0)";
            button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        };
        
        // Add to document
        document.body.appendChild(button);
    }
    
    // Show the rewards redemption panel
    showRewardsPanel() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'rewards-overlay';
        
        // Style overlay
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "2000"
        });
        
        // Create panel
        const panel = document.createElement('div');
        panel.className = 'rewards-panel';
        
        // Style panel
        Object.assign(panel.style, {
            width: "90%",
            maxWidth: "600px",
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.3)",
            padding: "20px",
            maxHeight: "80vh",
            overflow: "auto",
            border: "5px solid #ffc107",
            position: "relative",
            fontFamily: "'Nunito', sans-serif",
            animation: "pop 0.5s"
        });
        
        // Create header
        const header = document.createElement('div');
        header.innerHTML = `
            <h2 style="color: #9c27b0; margin-top: 0; text-align: center; font-family: 'Bubblegum Sans', cursive;">
                Nia's Rewards 🎁
            </h2>
            <p style="text-align: center; color: #555;">
                Earn points by playing games and redeem them for real rewards!
            </p>
        `;
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = "×";
        Object.assign(closeButton.style, {
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#9c27b0"
        });
        closeButton.onclick = () => overlay.remove();
        
        panel.appendChild(closeButton);
        panel.appendChild(header);
        
        // Get total points
        const totalPoints = this.getTotalPoints();
        
        // Create points display
        const pointsDisplay = document.createElement('div');
        Object.assign(pointsDisplay.style, {
            backgroundColor: "#f8f0ff",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "20px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            border: "2px dashed #9c27b0"
        });
        
        const pointsIcon = document.createElement('span');
        pointsIcon.textContent = "⭐";
        pointsIcon.style.fontSize = "24px";
        
        const pointsText = document.createElement('div');
        pointsText.innerHTML = `
            <div style="font-weight: bold; font-size: 16px;">Your Total Points</div>
            <div style="font-size: 24px; color: #9c27b0; font-weight: bold;">${totalPoints}</div>
        `;
        
        pointsDisplay.appendChild(pointsIcon);
        pointsDisplay.appendChild(pointsText);
        panel.appendChild(pointsDisplay);
        
        // Create rewards list
        const rewardsList = document.createElement('div');
        rewardsList.className = 'rewards-list';
        Object.assign(rewardsList.style, {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "15px",
            marginTop: "20px"
        });
        
        // Sort rewards by point threshold (low to high)
        const sortedRewards = [...this.rewardTiers].sort((a, b) => a.points - b.points);
        
        // Add each reward to the list
        sortedRewards.forEach(reward => {
            const rewardCard = this.createRewardCard(reward, totalPoints);
            rewardsList.appendChild(rewardCard);
        });
        
        panel.appendChild(rewardsList);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        
        // Add animation keyframe for pop effect
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes pop {
                0% { transform: scale(0.8); opacity: 0; }
                70% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Create a card for a specific reward
    createRewardCard(reward, totalPoints) {
        const isAvailable = totalPoints >= reward.points;
        const isClaimed = this.claimedRewards.includes(reward.id);
        
        const card = document.createElement('div');
        Object.assign(card.style, {
            backgroundColor: isClaimed ? "#e8f5e9" : (isAvailable ? "#fff" : "#f5f5f5"),
            borderRadius: "15px",
            padding: "15px",
            border: `2px solid ${isClaimed ? "#4caf50" : (isAvailable ? "#9c27b0" : "#ddd")}`,
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "flex",
            flexDirection: "column"
        });
        
        // Add hover effect for available rewards
        if (isAvailable && !isClaimed) {
            card.onmouseenter = () => {
                card.style.transform = "translateY(-5px)";
                card.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
            };
            
            card.onmouseleave = () => {
                card.style.transform = "translateY(0)";
                card.style.boxShadow = "none";
            };
        }
        
        // Reward icon
        const iconWrapper = document.createElement('div');
        Object.assign(iconWrapper.style, {
            fontSize: "40px",
            marginBottom: "10px",
            textAlign: "center"
        });
        iconWrapper.textContent = reward.icon;
        
        // Reward information
        const infoWrapper = document.createElement('div');
        
        const nameElement = document.createElement('h3');
        nameElement.textContent = reward.name;
        Object.assign(nameElement.style, {
            margin: "0 0 5px 0",
            color: isClaimed ? "#4caf50" : "#9c27b0",
            fontSize: "18px"
        });
        
        const descElement = document.createElement('p');
        descElement.textContent = reward.description;
        Object.assign(descElement.style, {
            margin: "0 0 10px 0",
            fontSize: "14px",
            color: "#666",
            flex: "1"
        });
        
        const pointsElement = document.createElement('div');
        pointsElement.textContent = `${reward.points} points`;
        Object.assign(pointsElement.style, {
            fontWeight: "bold",
            color: "#9c27b0",
            marginBottom: "15px"
        });
        
        infoWrapper.appendChild(nameElement);
        infoWrapper.appendChild(descElement);
        infoWrapper.appendChild(pointsElement);
        
        // Status indicator or claim button
        let actionElement;
        
        if (isClaimed) {
            actionElement = document.createElement('div');
            actionElement.innerHTML = "✅ Claimed";
            Object.assign(actionElement.style, {
                backgroundColor: "#4caf50",
                color: "white",
                padding: "8px 0",
                textAlign: "center",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold"
            });
        } else if (isAvailable) {
            actionElement = document.createElement('button');
            actionElement.textContent = "Claim Reward";
            Object.assign(actionElement.style, {
                backgroundColor: "#ffc107",
                color: "#7b1fa2",
                border: "none",
                padding: "10px 0",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                marginTop: "10px"
            });
            
            actionElement.onclick = () => this.claimReward(reward);
        } else {
            actionElement = document.createElement('div');
            actionElement.textContent = `${reward.points - totalPoints} more points needed`;
            Object.assign(actionElement.style, {
                backgroundColor: "#f5f5f5",
                color: "#666",
                padding: "8px 0",
                textAlign: "center",
                borderRadius: "8px",
                fontSize: "14px"
            });
        }
        
        card.appendChild(iconWrapper);
        card.appendChild(infoWrapper);
        card.appendChild(actionElement);
        
        return card;
    }
    
    // Handle reward claim
    claimReward(reward) {
        // Double-check if enough points
        const totalPoints = this.getTotalPoints();
        
        if (totalPoints < reward.points) {
            alert("Sorry, you don't have enough points to claim this reward yet.");
            return;
        }
        
        // Check if already claimed
        if (this.claimedRewards.includes(reward.id)) {
            alert("You've already claimed this reward!");
            return;
        }
        
        // Confirm claim
        if (confirm(`Are you sure you want to claim "${reward.name}" for ${reward.points} points? A parent will give you this reward!`)) {
            // Add to claimed rewards
            this.claimedRewards.push(reward.id);
            this.saveClaimedRewards();
            
            // Show success message
            this.showClaimConfirmation(reward);
            
            // Refresh rewards panel
            document.querySelector('.rewards-overlay').remove();
            this.showRewardsPanel();
        }
    }
    
    // Show confirmation when a reward is claimed
    showClaimConfirmation(reward) {
        // Create elements
        const overlay = document.createElement('div');
        overlay.className = 'claim-overlay';
        
        // Style the overlay
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "3000"
        });
        
        const confetti = document.createElement('div');
        confetti.className = 'reward-confetti';
        overlay.appendChild(confetti);
        
        // Create confirmation card
        const card = document.createElement('div');
        Object.assign(card.style, {
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "30px",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            border: "5px solid #ffc107",
            animation: "claim-pop 0.5s"
        });
        
        // Card content
        card.innerHTML = `
            <div style="font-size: 50px; margin-bottom: 10px;">${reward.icon}</div>
            <h2 style="color: #9c27b0; margin-top: 0; font-family: 'Bubblegum Sans', cursive;">
                Congratulations, Nia!
            </h2>
            <p style="font-size: 18px; margin-bottom: 5px;">
                You've claimed:
            </p>
            <div style="font-size: 24px; color: #9c27b0; font-weight: bold; margin-bottom: 20px;">
                ${reward.name}
            </div>
            <p style="color: #666; margin-bottom: 20px;">
                Show this to a parent to receive your reward!
            </p>
        `;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = "Close";
        Object.assign(closeBtn.style, {
            backgroundColor: "#ffc107",
            color: "#7b1fa2",
            border: "none",
            padding: "12px 25px",
            borderRadius: "50px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 0 #e6b00e",
            transition: "all 0.2s"
        });
        
        closeBtn.onmouseenter = () => {
            closeBtn.style.transform = "translateY(-2px)";
            closeBtn.style.boxShadow = "0 6px 0 #e6b00e";
        };
        
        closeBtn.onmouseleave = () => {
            closeBtn.style.transform = "translateY(0)";
            closeBtn.style.boxShadow = "0 4px 0 #e6b00e";
        };
        
        closeBtn.onclick = () => {
            overlay.style.opacity = "0";
            setTimeout(() => overlay.remove(), 500);
        };
        
        card.appendChild(closeBtn);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        
        // Trigger confetti
        if (window.confetti) {
            window.confetti.createConfetti();
        }
        
        // Add animation styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes claim-pop {
                0% { transform: scale(0.5); opacity: 0; }
                70% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Get total points from points system
    getTotalPoints() {
        // Try to get points from the points system
        if (window._gameController && window._gameController.pointsSystem) {
            return window._gameController.pointsSystem.totalPoints;
        }
        
        // Fallback to stored points
        try {
            const savedData = localStorage.getItem('memoryGameProgress');
            if (savedData) {
                const data = JSON.parse(savedData);
                return data.totalPoints || 0;
            }
        } catch (error) {
            console.error('Error reading total points:', error);
        }
        
        return 0;
    }
}

// Initialize the reward system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other components to initialize
    setTimeout(() => {
        window.rewardRedemption = new RewardRedemption();
    }, 1500);
});

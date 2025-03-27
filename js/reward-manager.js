/**
 * Simplified reward management interface for parents/teachers
 */

class RewardManager {
    constructor() {
        this.isOpen = false;
        this.createManagerUI();
    }
    
    createManagerUI() {
        // Create the panel
        this.panel = document.createElement('div');
        this.panel.className = 'reward-manager';
        this.panel.style.display = 'none';
        
        // Style the panel
        Object.assign(this.panel.style, {
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '350px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
            zIndex: '1200',
            fontFamily: "'Nunito', sans-serif",
            border: '3px solid #ffc107',
            overflow: 'hidden'
        });
        
        // Create header
        const header = document.createElement('div');
        Object.assign(header.style, {
            backgroundColor: '#9c27b0',
            color: 'white',
            padding: '12px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });
        
        const title = document.createElement('h3');
        title.textContent = 'Nia\'s Reward Manager';
        title.style.margin = '0';
        title.style.fontSize = '16px';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer'
        });
        closeBtn.addEventListener('click', () => this.hidePanel());
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        this.panel.appendChild(header);
        
        // Create content
        const content = document.createElement('div');
        content.style.padding = '15px';
        this.panel.appendChild(content);
        
        // Special Events Section
        const eventsSection = document.createElement('div');
        eventsSection.style.marginBottom = '20px';
        
        const eventsTitle = document.createElement('h4');
        eventsTitle.textContent = 'Special Events';
        eventsTitle.style.color = '#9c27b0';
        eventsTitle.style.marginTop = '0';
        
        eventsSection.appendChild(eventsTitle);
        
        // Event buttons
        const eventPresets = [
            { id: 'doublePoints', label: 'Double Points', description: 'Award double points for all actions' },
            { id: 'birthdayBonus', label: 'Birthday Bonus', description: 'Triple points for Nia\'s special day!' },
            { id: 'mathChallenge', label: 'Math Challenge', description: 'Bonus points for math games' },
            { id: 'spellingBee', label: 'Spelling Bee', description: 'Bonus points for spelling games' }
        ];
        
        const eventGrid = document.createElement('div');
        eventGrid.style.display = 'grid';
        eventGrid.style.gridTemplateColumns = '1fr 1fr';
        eventGrid.style.gap = '10px';
        
        eventPresets.forEach(event => {
            const eventCard = document.createElement('div');
            Object.assign(eventCard.style, {
                border: '2px solid #e1bee7',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s'
            });
            
            const eventName = document.createElement('div');
            eventName.textContent = event.label;
            eventName.style.fontWeight = 'bold';
            eventName.style.marginBottom = '5px';
            
            const eventDesc = document.createElement('div');
            eventDesc.textContent = event.description;
            eventDesc.style.fontSize = '12px';
            eventDesc.style.color = '#666';
            
            eventCard.appendChild(eventName);
            eventCard.appendChild(eventDesc);
            
            // Make it toggleable
            eventCard.addEventListener('click', () => {
                if (window.RewardPresets) {
                    const isActive = window.rewardController.isEventActive(event.id);
                    
                    if (isActive) {
                        window.rewardController.deactivateEvent(event.id);
                        eventCard.style.backgroundColor = '';
                        eventCard.style.borderColor = '#e1bee7';
                    } else {
                        window.RewardPresets.activateEvent(event.id);
                        eventCard.style.backgroundColor = '#f3e5f5';
                        eventCard.style.borderColor = '#9c27b0';
                    }
                }
            });
            
            eventGrid.appendChild(eventCard);
        });
        
        eventsSection.appendChild(eventGrid);
        content.appendChild(eventsSection);
        
        // Difficulty Presets
        const difficultySection = document.createElement('div');
        
        const difficultyTitle = document.createElement('h4');
        difficultyTitle.textContent = 'Reward Difficulty';
        difficultyTitle.style.color = '#9c27b0';
        difficultyTitle.style.marginTop = '10px';
        
        difficultySection.appendChild(difficultyTitle);
        
        const difficultyOptions = [
            { id: 'beginner', label: 'Beginner (Easier rewards)', description: 'Higher base points, easier to earn rewards' },
            { id: 'balanced', label: 'Balanced (Normal rewards)', description: 'Default balanced reward settings' },
            { id: 'challenging', label: 'Challenging (Harder rewards)', description: 'Lower base points, more challenging to earn rewards' }
        ];
        
        const radioGroup = document.createElement('div');
        
        difficultyOptions.forEach(option => {
            const label = document.createElement('label');
            Object.assign(label.style, {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
            });
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'difficultyPreset';
            radio.value = option.id;
            radio.style.marginRight = '10px';
            
            // Set balanced as default
            if (option.id === 'balanced') {
                radio.checked = true;
            }
            
            const labelText = document.createElement('div');
            labelText.innerHTML = `<div><b>${option.label}</b></div>
                                 <div style="font-size: 12px; color: #666;">${option.description}</div>`;
            
            label.appendChild(radio);
            label.appendChild(labelText);
            
            radio.addEventListener('change', () => {
                if (radio.checked && window.RewardPresets) {
                    window.RewardPresets.applyDifficultyPreset(option.id);
                }
            });
            
            radioGroup.appendChild(label);
        });
        
        difficultySection.appendChild(radioGroup);
        content.appendChild(difficultySection);
        
        // Advanced settings link
        const advancedLink = document.createElement('div');
        advancedLink.innerHTML = '<a href="#" style="color: #9c27b0;">Advanced Settings</a>';
        advancedLink.style.textAlign = 'center';
        advancedLink.style.marginTop = '15px';
        advancedLink.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            if (window.showAdminPanel) {
                window.showAdminPanel();
            } else {
                const password = prompt("Enter admin password:", "");
                if (password === "admin123" && window.rewardController) {
                    window.rewardController.enableAdminMode(password);
                    const adminPanel = new AdminPanel(window.rewardController);
                    adminPanel.showPanel();
                }
            }
        });
        
        content.appendChild(advancedLink);
        
        // Add to document
        document.body.appendChild(this.panel);
    }
    
    showPanel() {
        this.panel.style.display = 'block';
        this.isOpen = true;
    }
    
    hidePanel() {
        this.panel.style.display = 'none';
        this.isOpen = false;
    }
    
    togglePanel() {
        if (this.isOpen) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create reward manager and add button
    setTimeout(() => {
        const rewardManager = new RewardManager();
        window.rewardManager = rewardManager;
        
        // Add reward manager button
        const managerBtn = document.createElement('button');
        managerBtn.textContent = "Rewards";
        managerBtn.title = "Manage rewards and special events";
        
        Object.assign(managerBtn.style, {
            position: "fixed",
            bottom: "20px",
            left: "170px",
            zIndex: "1000",
            padding: "8px 12px",
            background: "#ffc107", 
            color: "#7b1fa2",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
            fontSize: "14px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: "bold"
        });
        
        managerBtn.addEventListener('click', () => {
            rewardManager.togglePanel();
        });
        
        document.body.appendChild(managerBtn);
    }, 1000);
});

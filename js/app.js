// Main application entry point

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Memory Game with Reward System...");
    
    try {
        // Create reward controller first
        const rewardController = new RewardController();
        
        // Make it available globally for debugging
        window.rewardController = rewardController;
        
        // Create admin panel for reward control
        const adminPanel = new AdminPanel(rewardController);
        
        // Create UI controller
        const ui = new UIController();
        
        // Create and initialize the game controller with the reward controller
        const gameController = new GameController(rewardController);
        
        // Store reference for debugging
        window._gameController = gameController;
        
        // Set up event hooks for active events
        setInterval(() => {
            // Update UI with any active events
            if (rewardController.activeEvents.length > 0) {
                const activeEvents = rewardController.activeEvents.map(
                    eventId => rewardController.settings.events.find(e => e.id === eventId)
                ).filter(e => e); // Remove any undefined
                
                ui.updateActiveEvents(activeEvents);
            } else {
                ui.updateActiveEvents([]);
            }
        }, 2000);
        
        console.log("Memory Game initialized!");
        
        // Display helper text for admin mode
        console.info("Press Ctrl+Shift+A to access reward settings (password: admin123)");
        
        // Activate any special events if they exist in URL
        const urlParams = new URLSearchParams(window.location.search);
        const eventParam = urlParams.get('event');
        if (eventParam && rewardController.settings.events.some(e => e.id === eventParam)) {
            rewardController.activateEvent(eventParam);
            console.log(`Event '${eventParam}' activated from URL parameter`);
        }
    } catch (error) {
        console.error("Error initializing game:", error);
    }
});

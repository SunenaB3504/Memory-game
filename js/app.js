// Main application entry point

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Nia's Memory Game...");
    
    try {
        // Create reward controller first
        const rewardController = new RewardController();
        window.rewardController = rewardController;
        
        // Create and initialize the game controller
        const gameController = new GameController(rewardController);
        
        // Store reference for global access
        window._gameController = gameController;
        
        // Check if Start Game button exists
        const startGameBtn = document.getElementById('startGame');
        if (!startGameBtn) {
            console.error("Start Game button not found! Creating container elements...");
            
            // Create container and basic UI elements if they're missing
            const container = document.querySelector('.container');
            if (container && container.children.length === 0) {
                console.log("Container is empty, rebuilding basic UI...");
                
                // Reload the page to refresh the UI
                window.location.reload();
            }
        } else {
            console.log("Start Game button found, adding extra listeners...");
            
            // Add additional event listener directly to the button
            startGameBtn.addEventListener('click', function() {
                console.log("Start Game clicked - direct event handler");
                gameController.startGame();
            });
            
            // Set button color explicitly
            startGameBtn.style.color = "#ffeb3b";
        }
        
        console.log("Memory Game initialized successfully!");
    } catch (error) {
        console.error("Error initializing game:", error);
        alert("There was an error loading the game. Please try refreshing the page.");
    }
});

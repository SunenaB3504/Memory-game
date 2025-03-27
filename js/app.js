// Main application entry point

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize the game controller
    const gameController = new GameController();
    
    // Store reference for debugging
    window._gameController = gameController;
    
    console.log("Memory Game initialized!");
});

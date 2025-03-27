// Add this script tag just before the closing </body> tag in index.html

(function() {
    // Fix grid layout issues if any
    document.addEventListener('DOMContentLoaded', function() {
        const startButton = document.getElementById('startGame');
        const gameBoard = document.getElementById('gameBoard');
        
        // Apply initial styling to ensure game board is visible
        gameBoard.style.display = 'grid';
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        
        // Add listener to ensure game board is visible after starting game
        startButton.addEventListener('click', function() {
            setTimeout(function() {
                console.log("Verifying game board visibility...");
                
                // Check if game board is visible and has children
                const cardCount = gameBoard.querySelectorAll('.card').length;
                console.log(`Game board contains ${cardCount} cards`);
                
                // Force grid layout if no cards are visible
                if (cardCount > 0 && !gameBoard.style.display || gameBoard.style.display === 'none') {
                    console.log("Fixing game board visibility");
                    gameBoard.style.display = 'grid';
                }
            }, 200); // Check shortly after game start
        });
    });
})();

/**
 * This script fixes common layout issues with the game grid
 */

document.addEventListener('DOMContentLoaded', () => {
    // Function to fix grid layout issues
    function fixGridLayout() {
        // Get key elements
        const gameBoard = document.getElementById('gameBoard');
        const gameBoardSection2 = document.getElementById('gameBoardSection2');
        const proficiency = document.getElementById('proficiency');
        const difficulty = document.getElementById('difficulty');
        
        if (!gameBoard) {
            console.error('Game board not found');
            return;
        }
        
        // Adjust grid based on window width
        function adjustGrid() {
            const windowWidth = window.innerWidth;
            
            // Get current settings
            const currentDifficulty = difficulty ? difficulty.value : 'medium';
            const currentProficiency = proficiency ? proficiency.value : 'easy';
            
            // Different column counts based on screen size
            if (windowWidth < 576) {  // Extra small devices
                gameBoard.style.gridGap = '8px';
                if (gameBoardSection2) gameBoardSection2.style.gridGap = '8px';
                
                if (currentDifficulty === 'hard') {
                    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
                } else {
                    gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
            } 
            else if (windowWidth < 768) {  // Small devices
                gameBoard.style.gridGap = '10px';
                if (gameBoardSection2) gameBoardSection2.style.gridGap = '10px';
                
                if (currentDifficulty === 'hard') {
                    gameBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
                } else {
                    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
                }
            }
            else {  // Medium devices and larger
                gameBoard.style.gridGap = '12px';
                if (gameBoardSection2) gameBoardSection2.style.gridGap = '12px';
                
                if (currentDifficulty === 'hard') {
                    gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
                } else {
                    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
                }
            }
            
            // Special adjustments for warning level
            if (currentProficiency === 'warning' && gameBoardSection2) {
                gameBoardSection2.style.gridTemplateColumns = gameBoard.style.gridTemplateColumns;
            }
        }
        
        // Initial adjustment
        adjustGrid();
        
        // Adjust when window size changes
        window.addEventListener('resize', adjustGrid);
        
        // Listen for Start Game button click
        const startGameBtn = document.getElementById('startGame');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                // Let the game initialize first
                setTimeout(adjustGrid, 100);
            });
        }
    }
    
    // Try fixing layout after a brief delay to ensure DOM is ready
    setTimeout(fixGridLayout, 500);
    
    // Also add a click listener to startGame button to auto-fix
    const startGameBtn = document.getElementById('startGame');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            // Make sure event handler runs even if game stalls
            console.log("Start button clicked - ensuring game starts");
            setTimeout(() => {
                const gameBoard = document.getElementById('gameBoard');
                if (gameBoard && gameBoard.children.length === 0) {
                    console.log("Game board still empty, triggering manual game start");
                    // Try to manually initialize game if needed
                    if (window._gameController) {
                        window._gameController.startGame();
                    }
                }
            }, 1000);
        });
    }
});

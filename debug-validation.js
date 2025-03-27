/**
 * Debugging tool for card validation issues
 */

const DebugValidation = {
    // Check all current cards for proper attributes
    checkCardAttributes() {
        console.group("Card Attributes Check");
        
        const cards = document.querySelectorAll('.card');
        console.log(`Found ${cards.length} cards`);
        
        cards.forEach((card, index) => {
            console.log(`Card ${index + 1}:`, {
                id: card.id || 'no-id',
                matchGroup: card.dataset.matchGroup,
                value: card.dataset.value,
                isNumber: card.dataset.isNumber,
                isExpression: card.dataset.isExpression,
                isWord: card.dataset.isWord,
                isSpelling: card.dataset.isSpelling,
                isMeaning: card.dataset.isMeaning,
                classList: [...card.classList]
            });
        });
        
        console.groupEnd();
    },
    
    // Test expression matching logic
    testExpressionMatching() {
        console.group("Expression Matching Test");
        
        // Create test cards
        const testCards = [
            { number: 5, expression: '2+3' },
            { number: 8, expression: '10-2' },
            { number: 12, expression: '6+6' },
            { number: 3, expression: '8-5' }
        ];
        
        testCards.forEach(test => {
            // Create mock cards
            const numberCard = document.createElement('div');
            numberCard.dataset.isNumber = "true";
            numberCard.dataset.isExpression = "false";
            numberCard.dataset.matchGroup = `test-${test.number}`;
            numberCard.dataset.value = test.number.toString();
            
            const expressionCard = document.createElement('div');
            expressionCard.dataset.isNumber = "false";
            expressionCard.dataset.isExpression = "true";
            expressionCard.dataset.matchGroup = `test-${test.number}`;
            expressionCard.dataset.value = test.expression;
            
            // Get game modes instance
            const gameModes = window._gameController ? window._gameController.gameModes : null;
            if (!gameModes) {
                console.error("Game controller not available");
                return;
            }
            
            // Test match logic
            const isMatch = window._gameController.firstCard = numberCard;
            window._gameController.secondCard = expressionCard;
            window._gameController.currentProficiency = 'expression';
            
            // Use the checkForMatchEasy method directly
            console.log(`Testing ${test.number} with ${test.expression}:`, 
                        `Should match = ${gameModes.checkForMatchEasy()}`);
        });
        
        console.groupEnd();
    },
    
    // Fix common validation issues
    fixValidationIssues() {
        const gameController = window._gameController;
        if (!gameController) {
            console.error("Game controller not found");
            return;
        }
        
        // Clear any stuck state
        gameController.firstCard = null;
        gameController.secondCard = null;
        gameController.lockBoard = false;
        
        console.log("Board state reset");
        
        // Re-enable any cards that might be stuck
        document.querySelectorAll('.card:not(.matched)').forEach(card => {
            card.classList.remove('flipped');
        });
        
        return "Validation issues fixed";
    }
};

// Make available globally
window.DebugValidation = DebugValidation;

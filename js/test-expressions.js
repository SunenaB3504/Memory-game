/**
 * Test utility for number expression cards
 */

// Function to test expression cards creation
function testExpressionCards() {
    console.group("Testing Expression Cards");
    
    // Check if numberExpressionPairs is available
    if (!window.numberExpressionPairs) {
        console.error("numberExpressionPairs not found. Make sure number-expressions.js is loaded!");
        console.groupEnd();
        return false;
    }
    
    console.log(`Found ${window.numberExpressionPairs.length} number-expression pairs`);
    
    // Create a test card manager
    const cardManager = new CardManager();
    
    // Try creating cards
    const cards = cardManager.createNumberExpressionCards(4);
    console.log(`Created ${cards.length} cards:`, cards);
    
    // Check if we have pairs
    const numberCards = cards.filter(card => card.isNumber);
    const expressionCards = cards.filter(card => card.isExpression);
    
    console.log(`Number cards: ${numberCards.length}`);
    console.log(`Expression cards: ${expressionCards.length}`);
    
    // Check matching groups
    const groups = {};
    cards.forEach(card => {
        if (!groups[card.matchGroup]) groups[card.matchGroup] = [];
        groups[card.matchGroup].push(card);
    });
    
    let allValid = true;
    Object.entries(groups).forEach(([group, groupCards]) => {
        const hasNumber = groupCards.some(card => card.isNumber);
        const hasExpression = groupCards.some(card => card.isExpression);
        
        if (!hasNumber || !hasExpression) {
            console.error(`Group ${group} is invalid: missing ${!hasNumber ? 'number' : 'expression'} card`);
            allValid = false;
        }
    });
    
    if (allValid) {
        console.log("All card pairs are valid!");
    } else {
        console.error("Some card pairs are invalid!");
    }
    
    console.groupEnd();
    return allValid;
}

// Add to window for testing from console
window.testExpressionCards = testExpressionCards;

// Auto run test after delay
setTimeout(() => {
    console.log("Running expression card test...");
    testExpressionCards();
}, 2000);

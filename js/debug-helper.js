/**
 * Debug helper for expression cards
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if number-expression pairs are loaded
    console.log("Checking for number-expression pairs...");
    
    setTimeout(() => {
        if (typeof numberExpressionPairs !== 'undefined') {
            console.log(`Found ${numberExpressionPairs.length} number-expression pairs:`);
            console.table(numberExpressionPairs);
        } else {
            console.error("No numberExpressionPairs found in global scope!");
        }
        
        // Add global debug function to examine cards
        window.checkCards = function() {
            const cards = document.querySelectorAll('.card');
            console.group("Card Content Check");
            
            cards.forEach((card, index) => {
                const front = card.querySelector('.card-front');
                const content = front ? front.textContent : 'no content';
                const isNumber = card.dataset.isNumber === "true";
                const isExpression = card.dataset.isExpression === "true";
                
                console.log(`Card ${index}: ${content} (${isNumber ? 'number' : isExpression ? 'expression' : 'other'})`);
            });
            
            console.groupEnd();
        };
        
        // Add function to validate math expressions against their number values
        window.validateExpressions = function() {
            const cards = document.querySelectorAll('.card');
            console.group("Math Expression Validation");
            
            const numberCards = Array.from(cards).filter(card => card.dataset.isNumber === "true");
            const expressionCards = Array.from(cards).filter(card => card.dataset.isExpression === "true");
            
            console.log(`Found ${numberCards.length} number cards and ${expressionCards.length} expression cards`);
            
            if (numberCards.length > 0 && expressionCards.length > 0) {
                const pairs = [];
                numberCards.forEach(numCard => {
                    const value = numCard.dataset.value;
                    const matchingExpressions = expressionCards.filter(expCard => expCard.dataset.value === value);
                    
                    if (matchingExpressions.length > 0) {
                        pairs.push({
                            number: numCard.querySelector('.card-front').textContent,
                            expressions: matchingExpressions.map(card => card.querySelector('.card-front').textContent),
                            value: value
                        });
                    }
                });
                
                console.table(pairs);
                console.log(`Found ${pairs.length} valid number-expression pairs`);
            }
            
            console.groupEnd();
        };
        
        // Add function to simulate solving math expressions
        window.evaluateExpression = function(expression) {
            try {
                // Use Function constructor for safer evaluation
                const result = new Function('return ' + expression)();
                console.log(`Expression: ${expression} = ${result}`);
                return result;
            } catch (e) {
                console.error(`Invalid expression: ${expression}`);
                return null;
            }
        };
        
        console.log("Debug helper loaded! Available commands:");
        console.log("- window.checkCards() - Inspect all cards");
        console.log("- window.validateExpressions() - Validate math expressions");
        console.log("- window.evaluateExpression('2+2') - Evaluate a math expression");
    }, 1000);
});

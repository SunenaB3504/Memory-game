/**
 * Debug utilities for math expression matching
 */

const ExpressionDebug = {
    // Validate the expression matching setup
    validateExpressionCards() {
        console.group("Expression Cards Validation");
        
        const cards = document.querySelectorAll('.card');
        console.log(`Found ${cards.length} cards on the board`);
        
        // Group cards by match group
        const matchGroups = {};
        cards.forEach(card => {
            const group = card.dataset.matchGroup;
            if (!group) {
                console.warn("Card missing matchGroup:", card);
                return;
            }
            
            if (!matchGroups[group]) {
                matchGroups[group] = [];
            }
            matchGroups[group].push(card);
        });
        
        // Check each match group
        Object.entries(matchGroups).forEach(([group, cards]) => {
            console.log(`Group ${group} has ${cards.length} cards`);
            
            // Verify one number and one expression
            const numberCard = cards.find(card => card.dataset.isNumber === "true");
            const expressionCard = cards.find(card => card.dataset.isExpression === "true");
            
            if (!numberCard) {
                console.error(`Group ${group} is missing a number card!`);
            }
            
            if (!expressionCard) {
                console.error(`Group ${group} is missing an expression card!`);
            }
            
            if (numberCard && expressionCard) {
                console.log(`Group ${group} - Number: ${numberCard.querySelector('.card-front').textContent}, Expression: ${expressionCard.querySelector('.card-front').textContent}`);
                
                // Validate expression
                const number = parseInt(numberCard.querySelector('.card-front').textContent);
                const expression = expressionCard.querySelector('.card-front').textContent;
                
                // Try to evaluate the expression
                try {
                    const [operand1, operator, operand2] = expression.split(' ');
                    const num1 = parseInt(operand1);
                    const num2 = parseInt(operand2);
                    
                    let result;
                    if (operator === '+') {
                        result = num1 + num2;
                    } else if (operator === '-') {
                        result = num1 - num2;
                    }
                    
                    console.log(`Expression ${expression} evaluates to ${result}, expecting ${number}`);
                    if (result === number) {
                        console.log(`✓ Valid expression match!`);
                    } else {
                        console.error(`✗ Invalid expression match!`);
                    }
                } catch (e) {
                    console.error(`Error evaluating expression: ${e}`);
                }
            }
        });
        
        console.groupEnd();
    },
    
    // Add visual indicators to cards
    highlightExpressionCards() {
        const numberCards = document.querySelectorAll('.card[data-is-number="true"]');
        const expressionCards = document.querySelectorAll('.card[data-is-expression="true"]');
        
        // Highlight number cards
        numberCards.forEach(card => {
            card.style.boxShadow = "0 0 10px 2px rgba(233, 30, 99, 0.7)";
        });
        
        // Highlight expression cards
        expressionCards.forEach(card => {
            card.style.boxShadow = "0 0 10px 2px rgba(63, 81, 181, 0.7)";  
        });
        
        return `Highlighted ${numberCards.length} number cards and ${expressionCards.length} expression cards`;
    },

    // Check if numberExpressionPairs is available
    checkExpressionData() {
        console.group("Expression Data Check");
        
        if (typeof numberExpressionPairs !== 'undefined') {
            console.log(`Found numberExpressionPairs with ${numberExpressionPairs.length} items:`);
            console.table(numberExpressionPairs);
        } else if (window.numberExpressionPairs) {
            console.log(`Found window.numberExpressionPairs with ${window.numberExpressionPairs.length} items:`);
            console.table(window.numberExpressionPairs);
        } else {
            console.error("No numberExpressionPairs found! Check themes.js");
        }
        
        console.groupEnd();
        
        return "Data check complete. See console for details.";
    }
};

// Make it available globally
window.ExpressionDebug = ExpressionDebug;

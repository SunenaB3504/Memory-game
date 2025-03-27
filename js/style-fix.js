/**
 * Add specific styles for numbers and expressions cards
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for everything to load
    setTimeout(() => {
        // Add expression card styles
        const style = document.createElement('style');
        style.textContent = `
            .number-card .card-front {
                font-size: 32px !important;
                color: #E91E63 !important;
                font-weight: bold !important;
            }
            
            .expression-card .card-front {
                font-size: 24px !important;
                font-family: 'Courier New', monospace !important;
                color: #3F51B5 !important;
                font-weight: bold !important;
            }
        `;
        document.head.appendChild(style);
        
        // Check for expression cards
        setTimeout(() => {
            const expressionCards = document.querySelectorAll('.expression-card');
            console.log(`Found ${expressionCards.length} expression cards`);
            
            if (expressionCards.length > 0) {
                console.log("Expression cards content check:");
                expressionCards.forEach(card => {
                    const content = card.querySelector('.card-front');
                    if (content) {
                        console.log(`- ${content.textContent}`);
                    }
                });
            }
        }, 1000);
    }, 500);
});

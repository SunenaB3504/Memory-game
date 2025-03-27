/**
 * Debug utilities for match validation
 * 
 * Add this script to your HTML and use in console:
 * DebugMatching.validateAllMatches();
 */

const DebugMatching = {
    validateAllMatches() {
        console.group("Match Validation");
        
        const cards = document.querySelectorAll('.card');
        const matchGroups = {};
        
        // Group cards by match group
        cards.forEach(card => {
            const group = card.dataset.matchGroup;
            if (!group) return;
            
            if (!matchGroups[group]) {
                matchGroups[group] = [];
            }
            matchGroups[group].push(card);
        });
        
        console.log(`Found ${Object.keys(matchGroups).length} match groups`);
        
        // Check each match group
        Object.entries(matchGroups).forEach(([group, groupCards]) => {
            console.log(`Group ${group}: ${groupCards.length} cards`);
            
            // Check for proper card attributes
            const hasEmptyAttributes = groupCards.some(card => {
                const attrs = ['value', 'cardType', 'matchGroup'];
                return attrs.some(attr => !card.dataset[attr]);
            });
            
            if (hasEmptyAttributes) {
                console.error(`Group ${group} has cards with missing attributes`);
            }
            
            // Specific validation for multi-name cards
            if (groupCards.some(card => card.dataset.isEmoji !== undefined)) {
                const emoji = groupCards.find(card => card.dataset.isEmoji === "true");
                const names = groupCards.filter(card => card.dataset.isName === "true");
                
                if (!emoji) {
                    console.error(`Group ${group} is missing emoji card`);
                }
                
                if (names.length !== 2) {
                    console.error(`Group ${group} has ${names.length} name cards, should have 2`);
                }
            }
            
            // Validate arithmetic cards
            if (groupCards.some(card => card.dataset.matchOp)) {
                const op = groupCards[0].dataset.matchOp;
                console.log(`Group ${group} is arithmetic operation: ${op}`);
                
                if (op === 'add') {
                    const sum = groupCards.find(card => card.dataset.isSum === "true");
                    const addends = groupCards.filter(card => card.dataset.isAddend === "true");
                    
                    if (!sum) {
                        console.error(`Group ${group} has no sum card`);
                    }
                    
                    if (addends.length !== 2) {
                        console.error(`Group ${group} has ${addends.length} addend cards, should have 2`);
                    }
                    
                    // Validate addition
                    if (sum && addends.length === 2) {
                        const sumVal = parseInt(sum.dataset.value);
                        const addend1 = parseInt(addends[0].dataset.value);
                        const addend2 = parseInt(addends[1].dataset.value);
                        
                        if (addend1 + addend2 !== sumVal) {
                            console.error(`Group ${group} addition is invalid: ${addend1} + ${addend2} ≠ ${sumVal}`);
                        }
                    }
                }
                
                // Add similar checks for other operations
            }
        });
        
        console.groupEnd();
        return "Validation complete";
    },
    
    fixMultiNameCards() {
        // Repair multi-name cards if second name card is missing
        const matchGroups = {};
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const group = card.dataset.matchGroup;
            if (!group) return;
            
            if (!matchGroups[group]) {
                matchGroups[group] = [];
            }
            matchGroups[group].push(card);
        });
        
        Object.entries(matchGroups).forEach(([group, groupCards]) => {
            if (groupCards.length === 2 && 
                groupCards.some(card => card.dataset.isEmoji === "true") && 
                groupCards.some(card => card.dataset.isName === "true")) {
                
                console.warn(`Group ${group} is missing a name card, attempting to fix...`);
                // This is just a diagnostic - actual fixes would require modifying the DOM
            }
        });
        
        return "Scan complete";
    },

    checkGameCompletionStatus() {
        const totalCards = document.querySelectorAll('.card').length;
        const matchedCards = document.querySelectorAll('.card.matched').length;
        const gameController = window._gameController;
        
        console.group("Game Completion Status");
        console.log(`Total Cards on Board: ${totalCards}`);
        console.log(`Matched Cards: ${matchedCards}`);
        
        if (gameController) {
            console.log(`Current Matches: ${gameController.matches}`);
            console.log(`Card Pairs Needed: ${gameController.cardPairs}`);
            console.log(`Is Complete: ${gameController.matches >= gameController.cardPairs}`);
            
            const isMultiNameGame = document.querySelector('.card[data-is-emoji]') !== null;
            if (isMultiNameGame) {
                const emojiCards = document.querySelectorAll('.card[data-is-emoji="true"]').length;
                const matchedEmojiCards = document.querySelectorAll('.card[data-is-emoji="true"].matched').length;
                const nameCards = document.querySelectorAll('.card[data-is-name="true"]').length;
                const matchedNameCards = document.querySelectorAll('.card[data-is-name="true"].matched').length;
                
                console.log(`Multi-name game detected:`);
                console.log(`- Emoji Cards: ${matchedEmojiCards}/${emojiCards} matched`);
                console.log(`- Name Cards: ${matchedNameCards}/${nameCards} matched`);
                console.log(`- Expected ratio: Each emoji should match 2 names`);
            }
        } else {
            console.log("Game controller not found. Add window._gameController = this; to the constructor.");
        }
        console.groupEnd();
        
        return {
            totalCards,
            matchedCards,
            unmatchedCards: totalCards - matchedCards,
            percentComplete: Math.floor((matchedCards / totalCards) * 100)
        };
    }
};

// Add to window object for console access
window.DebugMatching = DebugMatching;

// Automatically run validation when DEBUG=true in URL
if (window.location.search.includes('DEBUG=true')) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log("Running automatic match validation...");
            DebugMatching.validateAllMatches();
        }, 1000);
    });
}

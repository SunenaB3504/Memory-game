/**
 * Debugging tools for the spelling challenge
 */

const SpellingDebug = {
    // Check if card pairs are correctly set up
    validateSpellingCards() {
        console.group("Spelling Cards Validation");
        
        const cards = document.querySelectorAll('.card');
        const matchGroups = {};
        
        console.log(`Found ${cards.length} cards on the board`);
        
        // Group cards by match group
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
        
        console.log(`Found ${Object.keys(matchGroups).length} match groups`);
        
        // Analyze each match group
        Object.entries(matchGroups).forEach(([group, groupCards]) => {
            console.log(`Group ${group}: ${groupCards.length} cards`);
            
            // Log card attributes
            groupCards.forEach(card => {
                console.log(
                    `Card: id=${card.id}, isWord=${card.dataset.isWord}, ` +
                    `isSpelling=${card.dataset.isSpelling}, isMeaning=${card.dataset.isMeaning}`
                );
            });
            
            // Check for required attributes based on game mode
            const proficiency = document.getElementById('proficiency').value;
            
            if (proficiency === 'easy') {
                const hasWordCard = groupCards.some(card => card.dataset.isWord === "true");
                const hasSpellingCard = groupCards.some(card => card.dataset.isSpelling === "true");
                
                if (!hasWordCard || !hasSpellingCard) {
                    console.error(`Group ${group} is missing required card types`);
                } else {
                    console.log(`Group ${group} has valid word-spelling pair`);
                }
            }
            else if (proficiency === 'warning') {
                const hasWordCard = groupCards.some(card => card.dataset.isWord === "true");
                const hasMeaningCard = groupCards.some(card => card.dataset.isMeaning === "true");
                
                if (!hasWordCard || !hasMeaningCard) {
                    console.error(`Group ${group} is missing required card types`);
                } else {
                    console.log(`Group ${group} has valid word-meaning pair`);
                }
            }
            else if (proficiency === 'danger') {
                const hasWordCard = groupCards.some(card => card.dataset.isWord === "true");
                const hasSpellingCard = groupCards.some(card => card.dataset.isSpelling === "true");
                const hasMeaningCard = groupCards.some(card => card.dataset.isMeaning === "true");
                
                if (!hasWordCard || !hasSpellingCard || !hasMeaningCard) {
                    console.error(`Group ${group} is missing required card types`);
                } else {
                    console.log(`Group ${group} has valid word-spelling-meaning trio`);
                }
            }
        });
        
        console.groupEnd();
    },
    
    // Add debug info overlay to cards
    addCardDebugInfo() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            // Create debug overlay
            const debugOverlay = document.createElement('div');
            debugOverlay.className = 'debug-overlay';
            Object.assign(debugOverlay.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '5px',
                fontSize: '10px',
                zIndex: '10',
                display: 'none'
            });
            
            // Add debug info
            debugOverlay.textContent = 
                `Group: ${card.dataset.matchGroup || 'none'}
                Word: ${card.dataset.isWord || 'false'}
                Spelling: ${card.dataset.isSpelling || 'false'}
                Meaning: ${card.dataset.isMeaning || 'false'}`;
            
            card.appendChild(debugOverlay);
            card.style.position = 'relative';
            
            // Toggle debug overlay on right-click
            card.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                debugOverlay.style.display = 
                    debugOverlay.style.display === 'none' ? 'block' : 'none';
            });
        });
        
        console.log("Debug info added to cards. Right-click any card to see details.");
    }
};

// Make debugging tools available globally
window.SpellingDebug = SpellingDebug;

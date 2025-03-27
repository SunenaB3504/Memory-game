// Handles card creation and management for different game modes

class CardManager {
    constructor() {
        this.currentTheme = null;
    }
    
    // Create standard cards for easy level
    createStandardCards(theme, pairsCount) {
        this.currentTheme = theme;
        
        // Handle multi-name themes
        if (theme === 'emojiToMultipleEnglish' || theme === 'emojiToMultipleHindi') {
            return this.createMultiNameCards(theme, pairsCount);
        }
        
        // Handle word-meaning matching
        if (theme === 'englishWords' || theme === 'hindiWords') {
            const proficiency = document.getElementById('proficiency').value;
            
            switch(proficiency) {
                case 'easy':
                    return this.createWordMeaningCards(theme, pairsCount, 'easy');
                case 'warning':
                    return this.createWordMeaningCards(theme, pairsCount, 'warning');
                case 'danger':
                    return this.createWordMeaningCards(theme, pairsCount, 'danger');
            }
        }
        
        // Special handling for 'numbers' theme with different proficiency levels
        if (theme === 'numbers') {
            const proficiency = document.getElementById('proficiency').value;
            if (proficiency === 'easy') {
                return this.createNumberAdditionCards(pairsCount);
            } else if (proficiency === 'warning') {
                return this.createNumberMultiplicationCards(pairsCount);
            } else if (proficiency === 'danger') {
                return this.createNumberArithmeticCards(pairsCount);
            }
        }
        
        // Handle english spellings theme
        if (theme === 'englishSpellings') {
            const proficiency = document.getElementById('proficiency').value;
            
            switch(proficiency) {
                case 'easy':
                    return this.createSpellingCards(pairsCount);
                case 'warning':
                    return this.createConfusedWordsCards(pairsCount);
                case 'danger':
                    return this.createSpellingWithMeaningCards(pairsCount);
            }
        }
        
        // Create standard pairs
        const selectedImages = [...themes[theme]]
            .sort(() => 0.5 - Math.random())
            .slice(0, pairsCount);
        
        const cardPairsArray = [...selectedImages, ...selectedImages];
        
        return cardPairsArray.sort(() => 0.5 - Math.random());
    }
    
    // Create cards for word-to-meaning matching
    createWordMeaningCards(theme, pairsCount, proficiency) {
        const cards = [];
        
        // Select appropriate theme with meanings
        const themeWithMeanings = theme === 'englishWords' ? 
            themes.englishWordsWithMeanings : themes.hindiWordsWithMeanings;
        
        // Shuffle and select items
        const selectedItems = [...themeWithMeanings]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(pairsCount, themeWithMeanings.length));
        
        if (proficiency === 'easy') {
            // Easy: Direct word-to-meaning matching (one meaning per word)
            selectedItems.forEach((item, index) => {
                // Add word card
                cards.push({
                    id: `word-${index}`,
                    display: item.word,
                    type: 'word',
                    matchGroup: `group-${index}`,
                    isWord: true,
                    isMeaning: false,
                    matchType: 'word-meaning'
                });
                
                // Add meaning card (first meaning only for Easy level)
                cards.push({
                    id: `meaning-${index}`,
                    display: item.meanings[0],
                    type: 'meaning',
                    matchGroup: `group-${index}`,
                    isWord: false,
                    isMeaning: true,
                    matchType: 'word-meaning'
                });
            });
        } 
        else if (proficiency === 'warning') {
            // Warning: Each word has multiple meanings
            selectedItems.forEach((item, index) => {
                // Add word card
                cards.push({
                    id: `word-${index}`,
                    display: item.word,
                    type: 'word',
                    matchGroup: `group-${index}`,
                    isWord: true,
                    isMeaning: false,
                    matchType: 'word-meaning'
                });
                
                // Add both meanings
                item.meanings.forEach((meaning, mIndex) => {
                    cards.push({
                        id: `meaning-${index}-${mIndex}`,
                        display: meaning,
                        type: 'meaning',
                        matchGroup: `group-${index}`,
                        isWord: false,
                        isMeaning: true,
                        meaningIndex: mIndex,
                        matchType: 'word-meaning'
                    });
                });
            });
        }
        else if (proficiency === 'danger') {
            // Danger: Multiple related words and meanings to match
            // Group words into categories (for this demo, we'll create artificial categories)
            const categories = ['Nature', 'Animals', 'Actions', 'Objects'];
            
            // Create cards with category grouping
            let categoryIndex = 0;
            for (let i = 0; i < Math.min(4, pairsCount); i++) {
                // Select 2-3 words for this category
                const categoryWords = selectedItems.slice(i*3, i*3 + 3);
                if (categoryWords.length === 0) continue;
                
                // Create a category card
                cards.push({
                    id: `category-${i}`,
                    display: categories[i % categories.length],
                    type: 'category',
                    matchGroup: `category-${i}`,
                    isCategory: true,
                    isWord: false,
                    isMeaning: false,
                    matchType: 'word-meaning'
                });
                
                // Create word and meaning cards for this category
                categoryWords.forEach((item, wordIndex) => {
                    // Add word card
                    cards.push({
                        id: `word-${categoryIndex}-${wordIndex}`,
                        display: item.word,
                        type: 'word',
                        matchGroup: `category-${i}`,
                        isWord: true,
                        isMeaning: false,
                        categoryIndex: i,
                        matchType: 'word-meaning'
                    });
                    
                    // Add first meaning
                    cards.push({
                        id: `meaning-${categoryIndex}-${wordIndex}`,
                        display: item.meanings[0],
                        type: 'meaning',
                        matchGroup: `category-${i}`,
                        isWord: false,
                        isMeaning: true,
                        categoryIndex: i,
                        matchType: 'word-meaning'
                    });
                });
                categoryIndex++;
            }
        }
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Create cards for number addition matching (Easy proficiency level)
    createNumberAdditionCards(pairsCount) {
        // Create pairs where each number matches with two addends
        const cards = [];
        
        // Generate sum values (limited to keep the game manageable)
        const sums = [];
        for (let i = 0; i < pairsCount; i++) {
            // Generate sums between 5 and 20
            sums.push(Math.floor(Math.random() * 16) + 5);
        }
        
        // For each sum, create a card with the sum and two cards with addends
        sums.forEach((sum, index) => {
            // Generate random addends that add up to the sum
            const addend1 = Math.floor(Math.random() * (sum - 1)) + 1;
            const addend2 = sum - addend1;
            
            // Ensure we don't have addend1 === addend2 (boring matches)
            const finalAddend1 = addend1 === addend2 ? addend1 + 1 : addend1;
            const finalAddend2 = sum - finalAddend1;
            
            // Create the sum card
            cards.push({
                id: `sum-${index}`,
                display: `${sum}`,
                type: 'number',
                matchGroup: `group-${index}`,
                value: sum,
                isSum: true,
                isAddend: false,
                matchOp: 'add',
                // Store both addends for validation
                addend1: finalAddend1,
                addend2: finalAddend2
            });
            
            // Create the first addend card
            cards.push({
                id: `addend1-${index}`,
                display: `${finalAddend1}`,
                type: 'number',
                matchGroup: `group-${index}`,
                value: finalAddend1,
                isSum: false,
                isAddend: true,
                matchOp: 'add'
            });
            
            // Create the second addend card
            cards.push({
                id: `addend2-${index}`,
                display: `${finalAddend2}`,
                type: 'number',
                matchGroup: `group-${index}`,
                value: finalAddend2,
                isSum: false,
                isAddend: true,
                matchOp: 'add'
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Create cards for number multiplication matching (Warning proficiency level)
    createNumberMultiplicationCards(pairsCount) {
        const cards = [];
        
        // Generate products (limited to keep the game manageable)
        const products = [];
        for (let i = 0; i < pairsCount; i++) {
            // Generate products between 6 and 48
            products.push(Math.floor(Math.random() * 42) + 6);
        }
        
        // For each product, create a card with the product and two cards with factors
        products.forEach((product, index) => {
            // Find factors that multiply to product
            const factors = this.findFactors(product);
            
            // Skip if we couldn't find suitable factors
            if (factors.length < 2) {
                console.warn(`Couldn't find suitable factors for ${product}`);
                return;
            }
            
            // Pick two random factors
            const randomIndex = Math.floor(Math.random() * (factors.length - 1));
            const factor1 = factors[randomIndex];
            const factor2 = product / factor1;
            
            // Create the product card
            cards.push({
                id: `product-${index}`,
                display: `${product}`,
                type: 'number',
                matchGroup: `group-${index}`,
                value: product,
                isProduct: true,
                isFactor: false,
                matchOp: 'multiply'
            });
            
            // Create the first factor card
            cards.push({
                id: `factor1-${index}`,
                display: `${factor1}`,
                type: 'number',
                matchGroup: `group-${index}`,
                value: factor1,
                isProduct: false,
                isFactor: true,
                matchOp: 'multiply'
            });
            
            // Create the second factor card
            cards.push({
                id: `factor2-${index}`,
                display: `${factor2}`,
                type: 'number',
                matchGroup: `group-${index}`,
                value: factor2,
                isProduct: false,
                isFactor: true,
                matchOp: 'multiply'
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Helper function to find factors of a number
    findFactors(num) {
        const factors = [];
        for(let i = 2; i <= Math.floor(Math.sqrt(num)); i++) {
            if(num % i === 0) {
                factors.push(i);
                if(i !== num/i) factors.push(num/i);
            }
        }
        return factors.sort((a, b) => a - b);
    }
    
    // Create cards for any arithmetic operation (Danger proficiency level)
    createNumberArithmeticCards(pairsCount) {
        const cards = [];
        const operations = ['+', '-', '×', '÷'];
        
        // Create cards with different operations
        for (let i = 0; i < pairsCount; i++) {
            // Pick a random operation
            const op = operations[i % operations.length];
            const matchGroup = `group-${i}`;
            
            let num1, num2, result;
            
            switch(op) {
                case '+':
                    // Addition: result = num1 + num2
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                    result = num1 + num2;
                    break;
                case '-':
                    // Subtraction: result = num1 - num2 (ensure positive result)
                    num1 = Math.floor(Math.random() * 10) + 10;
                    num2 = Math.floor(Math.random() * num1);
                    result = num1 - num2;
                    break;
                case '×':
                    // Multiplication: result = num1 * num2
                    num1 = Math.floor(Math.random() * 9) + 2;
                    num2 = Math.floor(Math.random() * 9) + 2;
                    result = num1 * num2;
                    break;
                case '÷':
                    // Division: num1 = result * num2 (ensure integer division)
                    num2 = Math.floor(Math.random() * 9) + 2;
                    result = Math.floor(Math.random() * 9) + 2;
                    num1 = result * num2;
                    break;
            }
            
            // Create the result card
            cards.push({
                id: `result-${i}`,
                display: `${result}`,
                type: 'number',
                matchGroup: matchGroup,
                value: result,
                isResult: true,
                isOperand: false,
                isOperator: false,
                matchOp: op
            });
            
            // Create the first operand card
            cards.push({
                id: `operand1-${i}`,
                display: `${num1}`,
                type: 'number',
                matchGroup: matchGroup,
                value: num1,
                isResult: false,
                isOperand: true,
                isOperator: false,
                matchOp: op
            });
            
            // Create the operator card
            cards.push({
                id: `operator-${i}`,
                display: op,
                type: 'operator',
                matchGroup: matchGroup,
                value: op,
                isResult: false,
                isOperand: false,
                isOperator: true,
                matchOp: op
            });
        }
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Create cards for warning level
    createWarningLevelCards(theme, section1Count) {
        this.currentTheme = theme;
        
        // Select items from theme
        let themeItems = [];
        
        if (theme === 'emojiToEnglish' || theme === 'emojiToHindi') {
            themeItems = [...themes[theme]];
        } else {
            themeItems = [...themes[theme]].map(item => ({ value: item }));
        }
        
        // Shuffle and select items for section 1
        const selectedItems = themeItems
            .sort(() => 0.5 - Math.random())
            .slice(0, section1Count);
            
        // Create section1 cards (one card per match group)
        const section1Cards = selectedItems.map((item, index) => {
            const baseItem = item.emoji || item.value || item;
            return {
                id: `group-${index}`,
                display: baseItem,
                type: typeof baseItem === 'string' && baseItem.length > 1 ? 'text' : 'emoji',
                matchGroup: index
            };
        });
        
        // Create section2 cards (two cards per match group)
        const section2Cards = [];
        selectedItems.forEach((item, index) => {
            // Add two cards for each item
            const baseItem = item.emoji || item.value || item;
            const nameItem = item.name || baseItem;
            
            // First card - same as section1
            section2Cards.push({
                id: `group-${index}-1`,
                display: baseItem,
                type: typeof baseItem === 'string' && baseItem.length > 1 ? 'text' : 'emoji',
                matchGroup: index
            });
            
            // Second card - if we have a name property, use it, otherwise duplicate
            section2Cards.push({
                id: `group-${index}-2`,
                display: nameItem,
                type: typeof nameItem === 'string' && nameItem.length > 1 ? 'text' : 'emoji',
                matchGroup: index
            });
        });
        
        return {
            section1Cards: section1Cards.sort(() => 0.5 - Math.random()),
            section2Cards: section2Cards.sort(() => 0.5 - Math.random())
        };
    }
    
    // Create cards for danger level
    createDangerLevelCards(theme, groupsCount) {
        this.currentTheme = theme;
        
        // Select items from theme
        let themeItems = [];
        
        if (theme === 'emojiToEnglish' || theme === 'emojiToHindi') {
            themeItems = [...themes[theme]];
        } else {
            themeItems = [...themes[theme]].map(item => ({ value: item }));
        }
        
        // Shuffle and select items
        const selectedItems = themeItems
            .sort(() => 0.5 - Math.random())
            .slice(0, groupsCount);
            
        // Create three cards per match group
        const cards = [];
        const matchGroupLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        selectedItems.forEach((item, index) => {
            const baseItem = item.emoji || item.value || item;
            const nameItem = item.name || baseItem;
            const matchGroup = matchGroupLabels[index];
            
            // Create three variants for each match group
            cards.push({
                id: `group-${matchGroup}-1`,
                display: baseItem,
                type: typeof baseItem === 'string' && baseItem.length > 1 ? 'text' : 'emoji',
                matchGroup: matchGroup,
                matched: false
            });
            
            cards.push({
                id: `group-${matchGroup}-2`,
                display: nameItem,
                type: typeof nameItem === 'string' && nameItem.length > 1 ? 'text' : 'emoji',
                matchGroup: matchGroup,
                matched: false
            });
            
            // Third card is a different variant or duplicate if no variants available
            const thirdDisplay = typeof baseItem === 'string' ? baseItem.toUpperCase() : baseItem;
            cards.push({
                id: `group-${matchGroup}-3`,
                display: thirdDisplay,
                type: typeof thirdDisplay === 'string' && thirdDisplay.length > 1 ? 'text' : 'emoji',
                matchGroup: matchGroup,
                matched: false
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Create cards for multi-name matching
    createMultiNameCards(theme, pairsCount) {
        this.currentTheme = theme;
        
        let themeItems = [...themes[theme]];
        
        // Shuffle and select items
        themeItems = themeItems
            .sort(() => 0.5 - Math.random())
            .slice(0, pairsCount);
        
        const cards = [];
        
        // Create card sets (one emoji + two name cards for each item)
        themeItems.forEach((item, index) => {
            // Add emoji card
            cards.push({
                id: `emoji-${index}`,
                display: item.emoji,
                type: 'emoji',
                matchGroup: `group-${index}`,
                isEmoji: true,
                isName: false
            });
            
            // Add first name card
            cards.push({
                id: `name1-${index}`,
                display: item.names[0],
                type: 'text',
                matchGroup: `group-${index}`,
                isEmoji: false,
                isName: true,
                nameIndex: 0
            });
            
            // Add second name card - fixed missing code
            cards.push({
                id: `name2-${index}`,
                display: item.names[1],
                type: 'text',
                matchGroup: `group-${index}`,
                isEmoji: false,
                isName: true,
                nameIndex: 1
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Create cards for basic spelling matches (Easy level)
    createSpellingCards(pairsCount) {
        const cards = [];
        const spellings = [...themes.englishSpellings]
            .sort(() => 0.5 - Math.random())
            .slice(0, pairsCount);
        
        // Create word and correct spelling pairs
        spellings.forEach((item, index) => {
            // Add word card
            cards.push({
                id: `word-${index}`,
                display: item.word,
                type: 'spelling-word',
                matchGroup: `group-${index}`,
                isWord: true,
                isSpelling: false,
                matchType: 'spelling'
            });
            
            // Add correct spelling card
            cards.push({
                id: `spelling-${index}`,
                display: item.correctSpelling,
                type: 'spelling-correct',
                matchGroup: `group-${index}`,
                isWord: false,
                isSpelling: true,
                matchType: 'spelling'
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Create cards for confused words (Warning level)
    createConfusedWordsCards(pairsCount) {
        const cards = [];
        const confusedWords = [...themes.confusedWords]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(pairsCount, themes.confusedWords.length));
        
        confusedWords.forEach((item, index) => {
            // First word card
            cards.push({
                id: `word1-${index}`,
                display: item.word,
                type: 'spelling-word',
                matchGroup: `group-${index}-a`,
                isWord: true,
                isMeaning: false,
                matchType: 'confused-word'
            });
            
            // First meaning card
            cards.push({
                id: `meaning1-${index}`,
                display: item.meaning,
                type: 'spelling-meaning',
                matchGroup: `group-${index}-a`,
                isWord: false,
                isMeaning: true,
                matchType: 'confused-word'
            });
            
            // Second word card (confused with)
            cards.push({
                id: `word2-${index}`,
                display: item.confusedWith,
                type: 'spelling-word',
                matchGroup: `group-${index}-b`,
                isWord: true,
                isMeaning: false,
                matchType: 'confused-word'
            });
            
            // Second meaning card
            cards.push({
                id: `meaning2-${index}`,
                display: item.confusedMeaning,
                type: 'spelling-meaning',
                matchGroup: `group-${index}-b`,
                isWord: false,
                isMeaning: true,
                matchType: 'confused-word'
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }
    
    // Create spelling cards with meanings (Danger level)
    createSpellingWithMeaningCards(pairsCount) {
        const cards = [];
        const spellings = [...themes.englishSpellingsWithMeanings]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(pairsCount, themes.englishSpellingsWithMeanings.length));
        
        spellings.forEach((item, index) => {
            // Word card
            cards.push({
                id: `word-${index}`,
                display: item.word,
                type: 'spelling-word',
                matchGroup: `group-${index}`,
                isWord: true,
                isSpelling: false,
                isMeaning: false,
                matchType: 'spelling-meaning'
            });
            
            // Spelling card
            cards.push({
                id: `spelling-${index}`,
                display: item.correctSpelling,
                type: 'spelling-correct',
                matchGroup: `group-${index}`,
                isWord: false,
                isSpelling: true,
                isMeaning: false,
                matchType: 'spelling-meaning'
            });
            
            // Meaning card
            cards.push({
                id: `meaning-${index}`,
                display: item.meaning,
                type: 'spelling-meaning',
                matchGroup: `group-${index}`,
                isWord: false,
                isSpelling: false, 
                isMeaning: true,
                matchType: 'spelling-meaning'
            });
        });
        
        return cards.sort(() => 0.5 - Math.random());
    }
}

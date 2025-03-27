// Game settings for different difficulty and proficiency levels

// Difficulty settings (number of pairs for each level)
const difficultySettings = {
    easy: {
        pairsCount: 4,     // 8 cards total
        gridLayout: 'grid-template-columns: repeat(4, 1fr)'
    },
    medium: {
        pairsCount: 8,     // 16 cards total
        gridLayout: 'grid-template-columns: repeat(4, 1fr)'
    },
    hard: {
        pairsCount: 12,    // 24 cards total
        gridLayout: 'grid-template-columns: repeat(6, 1fr)'
    }
};

// Proficiency settings (different matching mechanics)
const proficiencySettings = {
    easy: {
        // Standard matching with pairs
        cardMultiplier: 2  // Each pair has 2 cards
    },
    warning: {
        // Match one card from section 1 with two cards from section 2
        section1Ratio: 1,   // 1 part for section 1
        section2Ratio: 2,   // 2 parts for section 2
        gridLayout1: 'grid-template-columns: repeat(4, 1fr)',
        gridLayout2: 'grid-template-columns: repeat(4, 1fr)'
    },
    danger: {
        // Complex matching with three cards per group
        cardMultiplier: 3,  // Each group has 3 cards
        gridAdjustment: 6   // Force wider grid for danger level
    }
};

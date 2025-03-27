/**
 * Math expression pairs for the Memory game
 * Each object contains a number and its corresponding expressions
 */

const mathExpressionPairs = [
    {
        number: 2,
        expressions: ["1+1", "4-2", "1×2"]
    },
    {
        number: 3,
        expressions: ["1+2", "6÷2", "5-2"]
    },
    {
        number: 4,
        expressions: ["2+2", "8÷2", "2×2"]
    },
    {
        number: 5,
        expressions: ["2+3", "10÷2", "1+4"]
    },
    {
        number: 6,
        expressions: ["3+3", "12÷2", "2×3"]
    },
    {
        number: 8,
        expressions: ["4+4", "16÷2", "2×4"]
    },
    {
        number: 9,
        expressions: ["3×3", "18÷2", "10-1"]
    },
    {
        number: 10,
        expressions: ["5+5", "20÷2", "2×5"]
    },
    {
        number: 12,
        expressions: ["6+6", "24÷2", "4×3"]
    },
    {
        number: 15,
        expressions: ["5×3", "30÷2", "10+5"]
    },
    {
        number: 16,
        expressions: ["8+8", "32÷2", "4×4"]
    },
    {
        number: 20,
        expressions: ["10+10", "40÷2", "4×5"]
    }
];

// Function to get a subset of pairs for different difficulty levels
function getMathPairs(count = 6) {
    // Shuffle the array and return the requested number of pairs
    return shuffle([...mathExpressionPairs]).slice(0, Math.min(count, mathExpressionPairs.length));
}

// Fisher-Yates shuffle algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

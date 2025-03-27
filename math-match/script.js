const cardPairs = [
    { number: "7", expression: "4 + 3" },
    { number: "12", expression: "3 × 4" },
    { number: "5", expression: "10 - 5" },
    { number: "9", expression: "15 ÷ 3" },
    { number: "8", expression: "2 + 6" },
    { number: "20", expression: "5 × 4" },
    { number: "3", expression: "7 - 4" },
    { number: "10", expression: "2 × 5" },
    { number: "6", expression: "12 ÷ 2" },
    { number: "15", expression: "9 + 6" },
    { number: "4", expression: "8 - 4" },
    { number: "18", expression: "3 × 6" }
];

const gameGrid = document.getElementById("game-grid");
const resetButton = document.getElementById("reset-button");
let flippedCards = [];
let matchedCards = [];

function createCard(value) {
    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("div");
    front.classList.add("front");
    front.textContent = "?";

    const back = document.createElement("div");
    back.classList.add("back");
    back.textContent = value;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener("click", () => flipCard(card, value));
    return card;
}

function setupGame() {
    gameGrid.innerHTML = "";
    flippedCards = [];
    matchedCards = [];

    // Combine numbers and expressions into one array and shuffle
    const allCards = [...cardPairs.map(pair => pair.number), ...cardPairs.map(pair => pair.expression)];
    allCards.sort(() => Math.random() - 0.5);

    // Create and append cards to the grid
    allCards.forEach(value => {
        const card = createCard(value);
        gameGrid.appendChild(card);
    });
}

function flipCard(card, value) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped") && !matchedCards.includes(value)) {
        card.classList.add("flipped");
        flippedCards.push({ card, value });

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const pair = cardPairs.find(p => 
        (p.number === card1.value && p.expression === card2.value) || 
        (p.number === card2.value && p.expression === card1.value)
    );

    if (pair) {
        matchedCards.push(card1.value, card2.value);
        flippedCards = [];
        if (matchedCards.length === cardPairs.length * 2) {
            setTimeout(() => alert("Yay! You matched all the cards!"), 500);
        }
    } else {
        setTimeout(() => {
            card1.card.classList.remove("flipped");
            card2.card.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

resetButton.addEventListener("click", setupGame);

// Start the game on page load
setupGame();
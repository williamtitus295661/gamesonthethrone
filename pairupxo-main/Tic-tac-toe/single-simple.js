const board = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const messageElement = document.getElementById('message');

let currentPlayer = 'X'; // User starts as 'X'
let boardState = Array(9).fill(null);

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Function to check for a winner
const checkWinner = () => {
    for (const [a, b, c] of winningCombinations) {
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return null;
};

// Function to display a message
const displayMessage = (message) => {
    messageElement.textContent = message;
};

// Function to find the best move for the computer
const findBestMove = () => {
    const emptyIndices = boardState
        .map((value, index) => value === null ? index : null)
        .filter(index => index !== null);

    // Check if there's a winning move
    for (const [a, b, c] of winningCombinations) {
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] !== 'X' && boardState[c] === null) {
            return c;
        }
        if (boardState[a] && boardState[a] === boardState[c] && boardState[a] !== 'X' && boardState[b] === null) {
            return b;
        }
        if (boardState[b] && boardState[b] === boardState[c] && boardState[b] !== 'X' && boardState[a] === null) {
            return a;
        }
    }

    // Block opponent's winning move
    for (const [a, b, c] of winningCombinations) {
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === 'X' && boardState[c] === null) {
            return c;
        }
        if (boardState[a] && boardState[a] === boardState[c] && boardState[a] === 'X' && boardState[b] === null) {
            return b;
        }
        if (boardState[b] && boardState[b] === boardState[c] && boardState[b] === 'X' && boardState[a] === null) {
            return a;
        }
    }

    // Choose a random move if no immediate win or block is found
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};

// Function to make the computer play as 'O'
const computerMove = () => {
    const bestMove = findBestMove();

    if (bestMove !== undefined) {
        boardState[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
    }

    // Check if the computer has won
    const winner = checkWinner();
    if (winner) {
        displayMessage(`${winner} wins!`);
    } else if (!boardState.includes(null)) {
        displayMessage("It's a draw!");
    }

    // Switch back to the user
    currentPlayer = 'X';
};

// Function to handle user clicks
const handleClick = (event) => {
    const index = event.target.dataset.index;

    // Only allow user to play if it's their turn, the cell is empty, and no one has won
    if (currentPlayer === 'X' && !boardState[index] && !checkWinner()) {
        boardState[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        
        // Check if the user has won
        const winner = checkWinner();
        if (winner) {
            displayMessage(`${winner} wins!`);
        } else if (!boardState.includes(null)) {
            displayMessage("It's a draw!");
        } else {
            // Switch to computer's turn
            currentPlayer = 'O';
            setTimeout(computerMove, 500); // Delay for a more natural feel
        }
    }
};

// Function to reset the game
const resetGame = () => {
    boardState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X'; // Start with user again
    displayMessage(''); // Clear the message
};

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);

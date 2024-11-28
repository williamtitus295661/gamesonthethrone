const board = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message'); // Get the message div

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

// Minimax algorithm for the computer to make optimal moves
const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner();
    if (winner === 'O') return 10 - depth; // Favor quicker wins
    if (winner === 'X') return depth - 10; // Favor slower losses
    if (!board.includes(null)) return 0;   // Draw

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                const evaluation = minimax(board, depth + 1, false);
                board[i] = null;
                maxEval = Math.max(maxEval, evaluation);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                const evaluation = minimax(board, depth + 1, true);
                board[i] = null;
                minEval = Math.min(minEval, evaluation);
            }
        }
        return minEval;
    }
};

// Function to make the computer play as 'O'
const computerMove = () => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === null) {
            boardState[i] = 'O';
            let score = minimax(boardState, 0, false);
            boardState[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    // Make the best move if there is an available spot
    if (bestMove !== null) {
        boardState[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
    }

    // Check if the computer has won
    const winner = checkWinner();
    if (winner) {
        showMessage(`${winner} wins!`);
    } else if (!boardState.includes(null)) {
        showMessage('It\'s a draw!');
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
            showMessage(`${winner} wins!`);
        } else if (!boardState.includes(null)) {
            showMessage('It\'s a draw!');
        } else {
            // Switch to computer's turn
            currentPlayer = 'O';
            setTimeout(computerMove, 500); // Delay for a more natural feel
        }
    }
};

// Function to show the message
const showMessage = (msg) => {
    message.textContent = msg;
    message.style.display = 'block'; // Show the message div
};

// Function to reset the game
const resetGame = () => {
    boardState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X'; // Start with user again
    message.style.display = 'none'; // Hide the message
};

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);

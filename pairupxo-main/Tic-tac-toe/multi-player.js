const board = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');

let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let xWinsCount = 0;
let oWinsCount = 0;

// Create and append the win counts table to the DOM
const createWinCountTable = () => {
    const winCountContainer = document.createElement('div');
    winCountContainer.id = 'win-count';

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Wins</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>X</td>
                    <td id="x-wins">0</td> <!-- Display count of X wins -->
                </tr>
                <tr>
                    <td>O</td>
                    <td id="o-wins">0</td> <!-- Display count of O wins -->
                </tr>
            </tbody>
        </table>
    `;

    winCountContainer.innerHTML = tableHTML;
    document.body.appendChild(winCountContainer); // Append the table to the body or another suitable container
};

// Call the function to create the win count table
createWinCountTable();

const xWinsDisplay = document.getElementById('x-wins');
const oWinsDisplay = document.getElementById('o-wins');

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

// Function to handle user clicks
const handleClick = (event) => {
    const index = event.target.dataset.index;

    // Prevent clicks on filled cells or if the game is already won
    if (boardState[index] || checkWinner()) return;

    // Set current player's move
    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    // Check for winner or draw
    const winner = checkWinner();
    if (winner) {
        showMessage(`${winner} wins!`);
        updateWinCount(winner);
    } else if (!boardState.includes(null)) {
        showMessage('It\'s a draw!');
    } else {
        // Switch player turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
};

// Function to show the game result message
const showMessage = (msg) => {
    message.textContent = msg;
    message.style.display = 'block'; // Display the message
};

// Function to update the win count
const updateWinCount = (winner) => {
    if (winner === 'X') {
        xWinsCount++;
        xWinsDisplay.textContent = xWinsCount;
    } else if (winner === 'O') {
        oWinsCount++;
        oWinsDisplay.textContent = oWinsCount;
    }
};

// Function to reset the game
const resetGame = () => {
    boardState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    message.style.display = 'none'; // Hide the message on reset
};


cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);

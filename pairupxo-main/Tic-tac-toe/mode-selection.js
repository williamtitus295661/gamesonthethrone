document.getElementById('single-player').addEventListener('click', () => {
    // Show difficulty selection buttons for single player mode
    document.getElementById('difficulty-selection').style.display = 'flex';
    document.getElementById('game-board').style.display = 'none'; // Hide game board until a difficulty is selected
    document.getElementById('reset').style.display = 'none';
});

document.getElementById('multi-player').addEventListener('click', () => {
    // Load multiplayer game script
    loadScript('multi-player.js');
});

document.getElementById('simple').addEventListener('click', () => {
    // Load simple game script for single-player mode
    loadScript('single-simple.js');
});

document.getElementById('complex').addEventListener('click', () => {
    // Load complex game script for single-player mode
    loadScript('single-complex.js');
});

function loadScript(scriptName) {
    // Show game board and reset button
    document.getElementById('game-board').style.display = 'grid';
    document.getElementById('reset').style.display = 'inline-block';

    // Remove difficulty selection buttons if they are visible
    const difficultySelection = document.getElementById('difficulty-selection');
    if (difficultySelection) {
        difficultySelection.style.display = 'none';
    }

    // Remove mode selection buttons after a mode is chosen
    document.querySelector('.mode-selection').style.display = 'none';

    // Dynamically load the selected game script
    const script = document.createElement('script');
    script.src = scriptName;
    document.body.appendChild(script);
}

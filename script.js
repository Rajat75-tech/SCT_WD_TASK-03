const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const modeSelectEl = document.getElementById('modeSelect');
const nameInputsEl = document.getElementById('nameInputs');
const player1El = document.getElementById('player1');
const player2El = document.getElementById('player2');
const turnDisplayEl = document.getElementById('turnDisplay');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameMode = '';
let gameOver = false;
let playerX = 'Player 1';
let playerO = 'Player 2';

function selectMode(mode) {
  gameMode = mode;
  nameInputsEl.style.display = 'flex';
  modeSelectEl.style.display = 'none';
  player2El.style.display = mode === 'friend' ? 'inline' : 'none';
  player1El.placeholder = "Enter Your Name";
  player2El.placeholder = "Enter Friend's Name";
}

function goBack() {
  nameInputsEl.style.display = 'none';
  modeSelectEl.style.display = 'flex';
  boardEl.innerHTML = '';
  statusEl.innerText = '';
  turnDisplayEl.innerText = '';
  // Reset all input fields and buttons
  nameInputsEl.querySelectorAll('input, button').forEach(el => el.style.display = '');
  nameInputsEl.style.justifyContent = 'center';
}

function startGame(mode) {
  playerX = player1El.value || 'Player 1';
  playerO = mode === 'friend' ? (player2El.value || 'Player 2') : 'AI Computer';
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  renderBoard();
  updateStatus();
  updateTurnDisplay();

  // Hide inputs and keep only Go Back button
  nameInputsEl.querySelectorAll('input, button:not(:last-child)').forEach(el => el.style.display = 'none');
  nameInputsEl.style.justifyContent = 'center';
}

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, index) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.innerText = cell;
    cellEl.onclick = () => handleClick(index);
    boardEl.appendChild(cellEl);
  });
}

function handleClick(index) {
  if (gameOver || board[index]) return;
  board[index] = currentPlayer;
  renderBoard();

  if (checkWin()) {
    statusEl.innerText = `${getPlayerName(currentPlayer)} wins!`;
    turnDisplayEl.innerText = '';
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    statusEl.innerText = "It's a draw!";
    turnDisplayEl.innerText = '';
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnDisplay();

  if (gameMode === 'computer' && currentPlayer === 'O' && !gameOver) {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  const emptyIndices = board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
  const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[move] = currentPlayer;
  renderBoard();

  if (checkWin()) {
    statusEl.innerText = `${getPlayerName(currentPlayer)} wins!`;
    turnDisplayEl.innerText = '';
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    statusEl.innerText = "It's a draw!";
    turnDisplayEl.innerText = '';
    gameOver = true;
    return;
  }

  currentPlayer = 'X';
  updateTurnDisplay();
}

function updateStatus() {
  if (gameMode === 'friend') {
    statusEl.innerHTML = `<span class="friend">You're playing with your Friend</span>`;
  } else if (gameMode === 'computer') {
    statusEl.innerHTML = `<span class="computer">You're playing with the AI Computer</span>`;
  }
}

function updateTurnDisplay() {
  turnDisplayEl.innerText = `${getPlayerName(currentPlayer)} is making a move...`;
}

function getPlayerName(symbol) {
  return symbol === 'X' ? playerX : playerO;
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}
'use strict';

const board = document.querySelector('.board');

const boxHeight = 50;
const boxWidth = 50;

const cols = Math.floor(board.clientWidth / boxWidth);
const rows = Math.floor(board.clientHeight / boxHeight);

const startBtn = document.querySelector('#startBtn');
const restartBtn = document.querySelector('#restartBtn');

const popupContainer = document.querySelector('.popup-cont');
const gameEndPopup = document.querySelector('.game-end-popup');
const startGamePopup = document.querySelector('.start-game-popup');

const scoreEl = document.querySelector('#score');
const finalScoreEl = document.querySelector('#finalScore');
const timeEl = document.querySelector('#time');

const blocks = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement('div');
    block.classList.add('box');
    board.appendChild(block);

    blocks[`${row}-${col}`] = block;
  }
}

const snake = [
  {
    x: 6,
    y: 16,
  },
];

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let destination = 'left';
let gameInterval = null;
let isGameRunning = false;

let score = 0;
let finalScore = 0;
let timer = 60;

let storedScore = Number(localStorage.getItem('score_data')) || 0;

if (storedScore) {
  finalScoreEl.innerText = storedScore;
}

const renderFun = function () {
  let head = { ...snake[0] };

  if (destination === 'down') {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (destination === 'up') {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (destination === 'left') {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (destination === 'right') {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  }

  if (head === null) return;

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    popupContainer.style.display = 'flex';
    gameEndPopup.style.display = 'flex';
    startGamePopup.style.display = 'none';

    isGameRunning = false;

    finalScore = storedScore;
    finalScoreEl.innerText = finalScore;

    clearInterval(gameInterval);
    return;
  }

  const hitSelf = snake.some(
    (segment) => segment.x === head.x && segment.y === head.y,
  );

  if (hitSelf) {
    popupContainer.style.display = 'flex';
    gameEndPopup.style.display = 'flex';
    startGamePopup.style.display = 'none';

    isGameRunning = false;

    finalScore = storedScore;
    finalScoreEl.innerText = finalScore;

    clearInterval(gameInterval);
    return;
  }

  removeFun();
  snake.unshift(head);
  snake.pop();

  snake.forEach((seng) => {
    blocks[`${seng.x}-${seng.y}`].classList.add('snake');
  });

  blocks[`${food.x}-${food.y}`].classList.add('food');

  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove('food');

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };

    blocks[`${food.x}-${food.y}`].classList.add('food');

    snake.push({ ...head });

    score++;
    scoreEl.innerText = score;

    if (score > storedScore) {
      storedScore = score;
      localStorage.setItem('score_data', storedScore);
    }
  }
};

const removeFun = function () {
  snake.forEach((seng) => {
    blocks[`${seng.x}-${seng.y}`].classList.remove('snake');
  });
};

let timerInterval;

const restartGame = function () {
  if (gameInterval) clearInterval(gameInterval);
  if (timerInterval) clearInterval(timerInterval);

  removeFun();
  snake.length = 0;
  snake.push({ x: 6, y: 16 });

  destination = 'left';

  blocks[`${food.x}-${food.y}`].classList.remove('food');
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  blocks[`${food.x}-${food.y}`].classList.add('food');

  popupContainer.style.display = 'none';
  gameEndPopup.style.display = 'none';

  isGameRunning = true;

  score = 0;
  scoreEl.innerText = score;
  timer = 60;

  timerInterval = setInterval(timerfun, 1000);
  gameInterval = setInterval(() => {
    renderFun();
  }, 200);
};

const timerfun = function () {
  if (timer <= 0) {
    clearInterval(gameInterval);

    popupContainer.style.display = 'flex';
    gameEndPopup.style.display = 'flex';
    startGamePopup.style.display = 'none';

    return;
  }

  timer--;

  let min = Math.floor(timer / 60);
  let sec = timer % 60;

  // format 00:00
  min = String(min).padStart(2, '0');
  sec = String(sec).padStart(2, '0');

  timeEl.innerText = `${min}:${sec}`;
};

timerfun();

document.addEventListener('keydown', (e) => {
  if (!isGameRunning && (e.key === 'Enter' || e.key === ' ')) {
    restartGame();
  }
});

document.addEventListener('click', (e) => {
  if (e.target === startBtn || e.target === restartBtn) {
    restartGame();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && destination !== 'down') destination = 'up';
  if (e.key === 'ArrowDown' && destination !== 'up') destination = 'down';
  if (e.key === 'ArrowLeft' && destination !== 'right') destination = 'left';
  if (e.key === 'ArrowRight' && destination !== 'left') destination = 'right';
});

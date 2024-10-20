let score = 0;
let bestScore = 0;
let ysdk;
let player;
let playerData = {};
let newData = {};

window.onload = () => {
  YaGames.init().then((_sdk) => {
    ysdk = _sdk;
    ysdk.getPlayer().then((_player) => {
      player = _player;
      loadPlayerData();
    });

    ysdk.features.LoadingAPI?.ready();
  });

  loadBestScore();
  loadGameState();
};

function saveGameState() {
  const gameState = {
    cells: cells.map((cell) => cell.value),
    score: score,
    bestScore: bestScore,
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem("gameState");
  if (savedState) {
    const gameState = JSON.parse(savedState);
    cells.forEach((cell, index) => {
      cell.value = gameState.cells[index];
      cell.element.innerHTML = cell.value ? cell.value : "";
    });
    score = gameState.score || 0;
    bestScore = gameState.bestScore || 0;
    updateBoard();
    updateScore();
  }
}

function updateScore() {
  // Обновляем текущий счёт
  document.querySelector(".current-score").innerHTML = score;

  // Обновляем лучший счёт, если текущий счёт больше
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }

  // Обновляем лучший счёт на экране
  document.querySelector(".best-score").innerHTML = bestScore;
}

function loadBestScore() {
  // Загружаем лучший счёт из localStorage
  bestScore = localStorage.getItem("bestScore") || 0;
  document.querySelector(".best-score").innerHTML = bestScore;
}

const popupCloseButtons = document.querySelectorAll(".popup__close-button");
const newGameButton = document.querySelector(".new_game-button");
const newGameButtonWin = document.querySelector(".win__game-Button");
let gridContainer = document.querySelector(".grid__container");
let scoreText = document.querySelector(".score__text");
const gameContainerWin = document.querySelector(".game__container-win");
const returnButton = document.querySelector(".return_button");

let gridCell;
let canUndo = true;
let gridSize = 4;
let touchStart = {
  x: null,
  y: null,
};

const platform = "yandex";
const platforms = {
  yandex: "yandex",
  other: "other",
};

function saveMove() {
  let state = cells.map((cell) => cell.value);
  moveHistory.push(state);
}

let moveHistory = [];
let cells = [];
function undoMove() {
  if (moveHistory.length > 0 && canUndo) {
    canUndo = false;
    let previousState = moveHistory.pop();
    cells.forEach((cell, index) => {
      cell.value = previousState[index];
    });
    updateBoard();
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowRight" || event.code === "KeyD") {
    moveRight();
  } else if (event.key === "ArrowLeft" || event.code === "KeyA") {
    moveLeft();
  } else if (event.key === "ArrowDown" || event.code === "KeyS") {
    moveDown();
  } else if (event.key === "ArrowUp" || event.code === "KeyW") {
    moveUp();
  }
}

function checkForWin() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].value == 2048) {
      ysdk.features.GameplayAPI?.stop(); // Сообщаем о завершении игрового процесса
      gameContainerWin.classList.add("game__container-win__active");
      document.removeEventListener("keyup", handleKeyUp);
    }
  }
}

function createGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    gridCell = document.createElement("div");
    gridCell.classList.add("grid-cell");
    gridCell.innerHTML = 0;
    gridContainer.appendChild(gridCell);
    cells.push({ element: gridCell, value: 0 });
  }
  addNumber();
  addNumber();
  updateBoard();
}

const mediaQuery = window.matchMedia("(max-width: 480px)");

function handleMediaChange(mediaQuery) {
  if (mediaQuery.matches) {
    resizeGrid(gridSize);
  }
}

mediaQuery.addEventListener("change", handleMediaChange); // Слушаем изменения

function resizeGrid(size) {
  gridSize = size;
  let cellSize;

  if (gridSize === 4) {
    cellSize = 100; // Размер ячейки для 4x4
  } else if (gridSize === 5) {
    cellSize = 90; // Размер ячейки для 5x5
  } else if (gridSize === 6) {
    cellSize = 70; // Размер ячейки для 6x6
  } else if (gridSize === 8) {
    cellSize = 50; // Размер ячейки для 8x8
  }

  // Проверяем размер окна или контейнера
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  // Изменяем размер ячеек в зависимости от ширины или высоты
  if (containerWidth < 480 || containerHeight < 480) {
    cellSize /= 1.5; // Уменьшаем размер ячейки в полтора раза при ширине или высоте меньше 480px
  }

  let gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
  let gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

  gridContainer.style.gridTemplateColumns = gridTemplateColumns;
  gridContainer.style.gridTemplateRows = gridTemplateRows;
}

function addNumber() {
  let available = cells.filter((cell) => cell.value === 0);
  if (available.length > 0) {
    let randomCell = available[Math.floor(Math.random() * available.length)];
    randomCell.value = Math.random() > 0.9 ? 4 : 2;
    randomCell.element.innerHTML = randomCell.value;
    if (randomCell.value == 2) {
      randomCell.element.classList.add("grid-cell-2");
    }
    if (randomCell.value == 4) {
      randomCell.element.classList.add("grid-cell-4");
    }
  }
}

function slideRight(row) {
  let arr = row.filter((val) => val);
  let missing = gridSize - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

function combineDown(row, score) {
  for (let i = gridSize - 1; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a === b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return { row, score };
}

function combineRight(row, score) {
  for (let i = gridSize - 1; i > 0; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a === b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return { row, score };
}

function moveRight() {
  saveMove();

  for (let i = 0; i < gridSize * gridSize; i += gridSize) {
    let row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push(cells[i + j].value);
    }
    row = slideRight(row);
    let result = combineRight(row, score); // Передаем score в функцию combineRight
    row = result.row;
    score = result.score;
    row = slideRight(row);
    for (let j = 0; j < gridSize; j++) {
      cells[i + j].value = row[j];
    }
  }

  addNumber();
  updateBoard();
  updateScore(); // Обновляем счёт после хода
  saveGameState(); // Сохраняем игру
  canUndo = true;
}

function moveLeft() {
  saveMove();

  for (let i = 0; i < gridSize * gridSize; i += gridSize) {
    let row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push(cells[i + gridSize - 1 - j].value);
    }
    row = slideRight(row);
    let result = combineRight(row, score);
    row = result.row;
    score = result.score;
    row = slideRight(row);
    for (let j = 0; j < gridSize; j++) {
      cells[i + gridSize - 1 - j].value = row[j];
    }
  }

  addNumber();
  updateBoard();
  updateScore(); // Обновляем счёт после хода
  saveGameState(); // Сохраняем игру
  canUndo = true;
}

// Обновление счёта и рекорда после начала новой игры
function newGame() {
  ysdk.features.GameplayAPI?.start(); // Сообщаем о старте игрового процесса

  ysdk.adv.showFullscreenAdv({
    callbacks: {
      onClose: function (wasShown) {
        // Действие после закрытия рекламы.
        gridContainer.innerHTML = "";
        cells = [];
        score = 0;
        updateScore();
        createGrid();
        saveGameState(); // Сохраняем игру
        gameContainerWin.classList.remove("game__container-win__active");
        document.addEventListener("keyup", handleKeyUp);
      },
      onError: function (error) {
        console.error(error);
      },
    },
  });
}

function moveUp() {
  saveMove();
  for (let i = 0; i < gridSize * gridSize; i++) {
    let row = [];
    for (let j = i; j < cells.length; j += gridSize) {
      row.push(cells[j].value);
    }
    row = slideLeft(row);
    let result = combineLeft(row, score);
    row = result.row;
    score = result.score;
    row = slideLeft(row);
    for (
      let j = i, k = 0;
      j < cells.length && k < row.length;
      j += gridSize, k++
    ) {
      cells[j].value = row[k];
    }
  }
  addNumber();
  updateBoard();
  updateScore(); // Обновляем счёт после хода
  saveGameState(); // Сохраняем игру
  canUndo = true;
}

function moveDown() {
  saveMove();
  for (let i = gridSize - 1; i >= 0; i--) {
    let row = [];
    for (let j = i; j < cells.length; j += gridSize) {
      row.push(cells[j].value);
    }
    row = slideRight(row);
    let result = combineDown(row, score);
    row = result.row;
    score = result.score;
    row = slideRight(row);
    for (
      let j = i, k = 0;
      j < cells.length && k < row.length;
      j += gridSize, k++
    ) {
      cells[j].value = row[k];
    }
  }
  addNumber();
  updateBoard();
  updateScore(); // Обновляем счёт после хода
  saveGameState(); // Сохраняем игру
  canUndo = true;
}

function combineLeft(row, score) {
  for (let i = 0; i <= 2; i++) {
    let a = row[i];
    let b = row[i + 1];
    if (a === b) {
      row[i] = a + b;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return { row, score };
}

function slideLeft(row) {
  if (!Array.isArray(row)) {
    console.error("Ошибка: slideLeft ожидает аргумент типа массив");
    return;
  }
  let arr = row.filter((val) => val);
  let missing = gridSize * gridSize - arr.length;
  let zeros = Array(missing).fill(0);
  arr = arr.concat(zeros);
  return arr;
}

function updateBoard() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    let cell = cells[i];

    if (cell.value === 0) {
      cell.element.innerHTML = "";
    } else {
      cell.element.innerHTML = cell.value;
    }
    cell.element.className = "grid-cell";
    if (cell.value) {
      cell.element.classList.add("grid-cell-" + cell.value);
    }
    if (cell.value > 2048) {
      cell.element.classList.add("grid-cell-super");
    }
  }
  checkForWin();
}

gridContainer.addEventListener("touchstart", function (event) {
  touchStart.x = event.touches[0].clientX;
  touchStart.y = event.touches[0].clientY;
});

gridContainer.addEventListener("touchmove", function (event) {
  if (!touchStart.x || !touchStart.y) {
    return;
  }
  let touchEndX = event.touches[0].clientX;
  let touchEndY = event.touches[0].clientY;
  let dx = touchEndX - touchStart.x;
  let dy = touchEndY - touchStart.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      moveRight();
      console.log("moveRight");
    } else {
      moveLeft();
      console.log("moveLeft");
    }
  } else {
    if (dy > 0) {
      moveDown();
      console.log("moveDown");
    } else {
      moveUp();
      console.log("moveUp");
    }
  }
  touchStart.x = null;
  touchStart.y = null;
});

gridContainer.addEventListener("touchend", function () {
  touchStart.x = null;
  touchStart.y = null;
});

newGameButtonWin.addEventListener("click", newGame);
newGameButton.addEventListener("click", newGame);
document.addEventListener("keyup", handleKeyUp);

returnButton.addEventListener("click", function () {
  // undoMove();
  // saveGameState(); // Сохраняем игру
  //
  ysdk.adv.showRewardedVideo({
    callbacks: {
      onOpen: () => {
        console.log("Video ad open.");
      },
      onRewarded: () => {
        console.log("Rewarded!");
        undoMove();
        saveGameState();
      },
      onClose: () => {
        console.log("Video ad closed.");
      },
      onError: (e) => {
        console.log("Error while open video ad:", e);
      },
    },
  });
});

function closePopup(popup) {
  popup.classList.remove("popup_opened");
  document.removeEventListener("click", closePopupOnBackgroundClick);
  document.removeEventListener("keydown", closePopupOnEscape);
}

function closePopupOnEscape(event) {
  if (event.key === "Escape") {
    const popup = document.querySelector(".popup_opened");
    closePopup(popup);
  }
}

function closePopupOnBackgroundClick(event) {
  if (event.target.classList.contains("popup_opened")) {
    closePopup(event.target);
  }
}

popupCloseButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    const popup = event.target.closest(".popup");
    closePopup(popup);
  });
});

window.addEventListener("resize", () => {
  resizeGrid(gridSize);
});

createGrid();
resizeGrid(4);

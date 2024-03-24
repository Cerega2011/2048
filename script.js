let newGameButton = document.querySelector(".new_game-button")
let newGameButtonWin = document.querySelector(".win__game-Button")
let gridContainer = document.querySelector(".grid__container")
let scoreText = document.querySelector(".score__text")
let gameContainerWin = document.querySelector(".game__container-win")
let chooseGame = document.querySelector(".choose__game")
let gridCell
let canUndo = true
let gridSize = 4
let touchStart = {
    x: null,
    y: null
}

let returnButton = document.querySelector('.return_button')
let moveHistory = []
let cells = []
let score = 0

function undoMove() {
    
    if (moveHistory.length > 0 && canUndo) {
        canUndo = false
        let previousState = moveHistory.pop()
        cells.forEach((cell, index) => {
            cell.value = previousState[index]
        })
        updateBoard()
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowRight' || event.code === 'KeyD') {
        moveRight();
    } else if (event.key === 'ArrowLeft' || event.code === 'KeyA') {
        moveLeft()
    } else if (event.key === 'ArrowDown' || event.code === 'KeyS') {
        moveDown()
    } else if (event.key === 'ArrowUp' || event.code === 'KeyW') {
        moveUp()
    }
}

function checkForWin() {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].value == 2048) {
            gameContainerWin.classList.add('game__container-win__active')
            document.removeEventListener('keyup', handleKeyUp)

        }

    }
}



function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        gridCell = document.createElement('div');
        gridCell.classList.add('grid-cell');
        gridCell.innerHTML = 0;
        gridContainer.appendChild(gridCell);
        cells.push({ element: gridCell, value: 0 });
    }
    addNumber();
    addNumber();
    updateBoard()
}

function resizeGrid(size) {
    gridSize = size;
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    gridContainer.innerHTML = '';
    cells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        gridCell = document.createElement('div');
        gridCell.classList.add('grid-cell');
        gridCell.innerHTML = 0;
        gridContainer.appendChild(gridCell);
        cells.push({ element: gridCell, value: 0 });
    }
    addNumber();
    addNumber();
    updateBoard();
}


function addNumber() {

    let available = cells.filter(cell => cell.value === 0);
    if (available.length > 0) {
        let randomCell = available[Math.floor(Math.random() * available.length)];
        randomCell.value = Math.random() > 0.9 ? 4 : 2;
        randomCell.element.innerHTML = randomCell.value;
        if (randomCell.value == 2) {
            randomCell.element.classList.add('grid-cell-2')

        }
        if (randomCell.value == 4) {
            randomCell.element.classList.add('grid-cell-4')

        }
    }

}

function slideRight(row) {
    let arr = row.filter(val => val);
    let missing = gridSize - arr.length;
    let zeros = Array(missing).fill(0);
    arr = zeros.concat(arr);
    return arr;
}

function combineDown(row) {
    for (let i = gridSize - 1; i >= 1; i--) {
        let a = row[i];
        let b = row[i - 1];
        if (a === b) {
            row[i] = a + b;
            score += row[i];
            row[i - 1] = 0;
        }
    }
    return row
}

function combineRight(row) {
    for (let i = gridSize - 1; i > 0; i--) {
        let a = row[i];
        let b = row[i - 1];
        if (a === b) {
            row[i] = a + b;
            score += row[i];
            row[i - 1] = 0;
        }
    }
    return row;
}

function moveRight() {
    let currentState = cells.map(cell => cell.value);
    moveHistory.push(currentState);

    for (let i = 0; i < gridSize * gridSize; i += gridSize) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(cells[i + j].value);
        }
        row = slideRight(row);
        row = combineRight(row);
        row = slideRight(row);
        for (let j = 0; j < gridSize; j++) {
            cells[i + j].value = row[j];
        }
    }

    addNumber();
    updateBoard();
    canUndo = true;
}

function moveLeft() {
    let currentState = cells.map(cell => cell.value)
    moveHistory.push(currentState)

    for (let i = 0; i < gridSize * gridSize; i += gridSize) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(cells[i + gridSize - 1 - j].value);
        }
        row = slideRight(row);
        row = combineRight(row);
        row = slideRight(row);
        for (let j = 0; j < gridSize; j++) {
            cells[i + gridSize - 1 - j].value = row[j];
        }
    }

    addNumber()
    updateBoard();
    canUndo = true;
}

function newGame() {
    gridContainer.innerHTML = '';
    cells = [];
    score = 0;
    updateScore();
    createGrid();
    gameContainerWin.classList.remove('game__container-win__active')
    document.addEventListener('keyup', handleKeyUp);
}

function moveUp() {
    let currentState = cells.map(cell => cell.value)
    moveHistory.push(currentState)
    for (let i = 0; i < gridSize * gridSize; i++) {
        let row = [];
        for (let j = i; j < cells.length; j += gridSize) {
            row.push(cells[j].value);
        }
        row = slideLeft(row);
        row = combineLeft(row);
        row = slideLeft(row);
        for (let j = i, k = 0; j < cells.length && k < row.length; j += gridSize, k++) {
            cells[j].value = row[k];
        }
    } 
    addNumber()
    updateBoard()
    canUndo = true
}

function moveDown() {
    let currentState = cells.map(cell => cell.value)
    moveHistory.push(currentState)
    for (let i = gridSize - 1; i >= 0; i--) {
        let row = [];
        for (let j = i; j < cells.length; j += gridSize) {
            row.push(cells[j].value);
        }
        row = slideRight(row);
        row = combineDown(row);
        row = slideRight(row);
        for (let j = i, k = 0; j < cells.length && k < row.length; j += gridSize, k++) {
            cells[j].value = row[k];
        }
    } 
    addNumber()
    updateBoard()
    
    canUndo = true
}


function combineLeft(row) {
    for (let i = 0; i <= 2; i++) {
        let a = row[i];
        let b = row[i + 1];
        if (a === b) {
            row[i] = a + b;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
}

function slideLeft(row) {
    let arr = row.filter(val => val);
    let missing = gridSize * gridSize - arr.length;
    let zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);
    return arr;
}

function updateBoard() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cell = cells[i];

        if (cell.value === 0) {
            cell.element.innerHTML = '';
        } else {
            cell.element.innerHTML = cell.value;
        }
        cell.element.className = 'grid-cell';
        if (cell.value) {
            cell.element.classList.add('grid-cell-' + cell.value);
        }
        if (cell.value > 2048) {
            cell.element.classList.add('grid-cell-super');
        }
    }
    updateScore();
    checkForWin()
}

function updateScore() {
    scoreText.innerText = score;
}



createGrid();

gridContainer.addEventListener('touchstart', function (event) {
    touchStart.x = event.touches[0].clientX
    touchStart.y = event.touches[0].clientY
})

gridContainer.addEventListener('touchmove', function (event) {
    if (!touchStart.x || !touchStart.y) {

        return
    }
    let touchEndX = event.touches[0].clientX
    let touchEndY = event.touches[0].clientY
    let dx = touchEndX - touchStart.x
    let dy = touchEndY - touchStart.y
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            moveRight()
            console.log('moveRight')
        } else {
            moveLeft()
            console.log('moveLeft')
        }
    } else {
        if (dy > 0) {
            moveDown()
            console.log('moveDown')
        } else {
            moveUp()
            console.log('moveUp')
        }
    }
    touchStart.x = null
    touchStart.y = null

})

gridContainer.addEventListener('touchend', function () {
    touchStart.x = null
    touchStart.y = null
})

newGameButtonWin.addEventListener('click', newGame)
newGameButton.addEventListener('click', newGame)
document.addEventListener('keyup', handleKeyUp);
returnButton.addEventListener('click', function () {
    undoMove()
    console.log('returnButton')
})
chooseGame.addEventListener('click', function(){
    resizeGrid(8)
})

let newGameButton = document.querySelector(".new_game-button")
let newGameButtonWin = document.querySelector(".win__game-Button")
let gridContainer = document.querySelector(".grid__container")
let scoreText = document.querySelector(".score__text")
let gameContainerWin = document.querySelector(".game__container-win")
let gridCell


let cells = []
let score = 0

function handleKeyUp(event) {
    if (event.key === 'ArrowRight' || event.code === 'KeyD' ) {
        moveRight();
    } else if (event.key === 'ArrowLeft' || event.code === 'KeyA' ) {
        moveLeft()
    } else if (event.key === 'ArrowDown'  || event.code === 'KeyS' ) {
        moveDown()
    } else if (event.key === 'ArrowUp'  || event.code === 'KeyW' ) {
        moveUp()
    }
}

function checkForWin() {
    for(let i = 0; i < cells.length; i++){
        if(cells[i].value == 16){
            gameContainerWin.classList.add('game__container-win__active')
            document.removeEventListener('keyup', handleKeyUp)

        }
        
    }
}



function createGrid() {
    for (let i = 0; i < 16; i++) {
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



function addNumber() {

        let available = cells.filter(cell => cell.value === 0);
    if (available.length > 0) {
        let randomCell = available[Math.floor(Math.random() * available.length)];
        randomCell.value = Math.random() > 0.9 ? 4 : 2;
        randomCell.element.innerHTML = randomCell.value;
        if(randomCell.value == 2){
            randomCell.element.classList.add('grid-cell-2')

        }
        if(randomCell.value == 4){
            randomCell.element.classList.add('grid-cell-4')

        }
    }
    
}

function slideRight(row) {
    let arr = row.filter(val => val);
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill(0);
    arr = zeros.concat(arr);
    return arr;
}

function combineRight(row) {
    for (let i = 3; i >= 1; i--) {
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
    for (let i = 0; i < 16; i += 4) {
      let row = [
        cells[i].value,
        cells[i + 1].value,
        cells[i + 2].value,
        cells[i + 3].value,
      ];
      row = slideRight(row);
      row = combineRight(row);
      row = slideRight(row);
      [
        cells[i].value,
        cells[i + 1].value,
        cells[i + 2].value,
        cells[i + 3].value,
      ] = row;
    }
    updateBoard();
  }



function moveLeft() {
    for (let i = 0; i < 16; i += 4) {
        let row = [cells[i].value, cells[i + 1].value, cells[i + 2].value, cells[i + 3].value]
        row = slideLeft(row)
        row = combineLeft(row);
        row = slideLeft(row);
        [cells[i].value, cells[i + 1].value, cells[i + 2].value, cells[i + 3].value] = row;
    }
    updateBoard()
}

function newGame() {
    gridContainer.innerHTML = '';
    cells = [];
    score = 0;
    updateScore();
    createGrid();
    gameContainerWin.classList.remove('game__container-win__active')
    document.addEventListener('keyup',handleKeyUp);
}

function moveUp() {
    for (let i = 0; i < 4; i++) {
        let row = [cells[i].value, cells[i + 4].value, cells[i + 8].value, cells[i + 12].value]
        row = slideLeft(row)
        row = combineLeft(row);
        row = slideLeft(row);
        [cells[i].value,cells[i + 4].value, cells[i + 8].value, cells[i + 12].value] = row;
    }
    updateBoard()
}

function moveDown() {
    for (let i = 0; i < 4; i++) {
        let row = [cells[i].value, cells[i + 4].value, cells[i + 8].value, cells[i + 12].value]
        row = slideRight(row)
        row = combineRight(row);
        row = slideRight(row);
        [cells[i].value,cells[i + 4].value, cells[i + 8].value, cells[i + 12].value] = row;
    }
    updateBoard()
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
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);
    return arr;
}

function updateBoard() {
    for (let i = 0; i < 16; i++) {
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
    addNumber();
    updateScore();
    checkForWin()
}
// function updateBoard() {
//     cells.forEach(cell => {
//         if (cell.moved) {
//             cell.element.classList.add('moving');
//             cell.element.style.setProperty('--moveX', `${cell.moveX * 110}px`); 
//             cell.element.style.setProperty('--moveY', `${cell.moveY * 110}px`);
//             setTimeout(() => {
//                 cell.element.classList.remove('moving');
//                 cell.moved = false; 
//             }, 200); 
//         }
//     });

//     for (let i = 0; i < 16; i++) {
//         let cell = cells[i];

//         if (cell.value === 0) {
//             cell.element.innerHTML = '';
//         } else {
//             cell.element.innerHTML = cell.value;
//         }
//         cell.element.className = 'grid-cell';
//         if (cell.value) {
//             cell.element.classList.add('grid-cell-' + cell.value);
//         }
//         if (cell.value > 2048) {
//             cell.element.classList.add('grid-cell-super');
//         }
//     }
//     addNumber();
//     updateScore();
// }

function updateScore() {
    scoreText.innerText = score;
}



createGrid();

newGameButtonWin.addEventListener('click',newGame)
newGameButton.addEventListener('click',newGame)
document.addEventListener('keyup',handleKeyUp);



// event.key == 'd' 
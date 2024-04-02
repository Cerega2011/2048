let newGameButton = document.querySelector(".new_game-button");
let newGameButtonWin = document.querySelector(".win__game-Button");
let gridContainer = document.querySelector(".grid__container");
let scoreText = document.querySelector(".score__text");
let gameContainerWin = document.querySelector(".game__container-win");
let closeButton = document.querySelector(".close");
let menu = document.querySelector(".menu");
let menuButton = document.querySelector(".menu-button");
let fieldButton4x4 = document.querySelector(".field4x4");
let fieldButton5x5 = document.querySelector(".field5x5");
let fieldButton6x6 = document.querySelector(".field6x6");
let fieldButton8x8 = document.querySelector(".field7x7");
let bgMusic = new Audio();
// bgMusic.src = "/sounds/bacroundMusic.mp3";
// bgMusic.volume = 0.3;
let gridCell;
let canUndo = true;
let gridSize = 4;
let touchStart = {
    x: null,
    y: null,
};

let returnButton = document.querySelector(".return_button");
let moveHistory = [];
let cells = [];
let score = 0;
// bgMusic.play()

export {
    newGameButton, newGameButtonWin, gridContainer, scoreText, gameContainerWin, closeButton, menu, menuButton, fieldButton4x4, fieldButton5x5, fieldButton6x6, fieldButton8x8,
    bgMusic, gridCell, canUndo, gridSize, touchStart, moveHistory, returnButton, cells, score
}
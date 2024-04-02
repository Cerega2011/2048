import { gridCell,cells,gridContainer,gridSize } from "./const";
import {addNumber,updateBoard} from './script'

export function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
      let newGridCell = document.createElement("div");
      newGridCell.classList.add("grid-cell");
      newGridCell.innerHTML = 0;
      gridContainer.appendChild(newGridCell);
      cells.push({ element: newGridCell, value: 0 });
    }
    addNumber();
    addNumber();
    updateBoard();
  }

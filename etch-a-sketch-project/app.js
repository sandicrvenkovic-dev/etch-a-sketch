const grid = document.querySelector('#grid');
const mode = document.querySelector('#mode');
const sizeLabel = document.querySelector('#grid-size');
let gridSize = 16;
let lastTouchSquare = null;

function createGrid(size) {
  gridSize = size;
  grid.style.setProperty('--grid-size', size);
  const squares = document.createDocumentFragment();

  for (let i = 0; i < size * size; i += 1) {
    const square = document.createElement('div');
    square.className = 'square';
    square.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') {
        paint(square);
      }
    });
    squares.appendChild(square);
  }
  grid.replaceChildren(squares);
  lastTouchSquare = null;
  sizeLabel.textContent = `${size} × ${size} grid`;
}

function randomChannel() {
  return Math.floor(Math.random() * 256);
}

function paint(square) {
  const useRandomColor = mode.value.includes('rainbow');
  const useDarkening = mode.value.includes('darken');
  let color = [41, 79, 67];

  if (useRandomColor) {
    color = [randomChannel(), randomChannel(), randomChannel()];
  } else if (useDarkening) {
    color = [255, 255, 255];
  }

  if (useDarkening) {
    const visits = Math.min(Number(square.dataset.visits || 0) + 1, 10);
    square.dataset.visits = visits;

    // Reduce brightness by 10% per visit. The tenth visit is black.
    const brightness = 1 - visits / 10;
    color = color.map((channel) => Math.round(channel * brightness));
  }

  square.style.backgroundColor = `rgb(${color.join(', ')})`;
}

function resizeGrid() {
  const input = window.prompt('How many squares per side? Enter a whole number from 1 to 100.', gridSize);
  if (input === null) {
    return;
  }

  const size = Number(input);
  if (!Number.isInteger(size) || size < 1 || size > 100) {
    window.alert('Please enter a whole number between 1 and 100.');
    return;
  }
  createGrid(size);
}

function clearGrid() {
  createGrid(gridSize);
}

function paintTouch(event) {
  if (event.pointerType !== 'touch') {
    return;
  }

  const square = document.elementFromPoint(event.clientX, event.clientY);
  if (square?.classList.contains('square') && square !== lastTouchSquare) {
    paint(square);
    lastTouchSquare = square;
  }
}

function resetTouch() {
  lastTouchSquare = null;
}

document.querySelector('#resize').addEventListener('click', resizeGrid);
document.querySelector('#clear').addEventListener('click', clearGrid);
mode.addEventListener('change', clearGrid);
grid.addEventListener('pointerdown', paintTouch);
grid.addEventListener('pointermove', paintTouch);
grid.addEventListener('pointerup', resetTouch);
grid.addEventListener('pointercancel', resetTouch);

createGrid(16);

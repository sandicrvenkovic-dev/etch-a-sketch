const grid = document.querySelector('#grid');
const mode = document.querySelector('#mode');
const sizeLabel = document.querySelector('#grid-size');
const resizeButton = document.querySelector('#resize');
const clearButton = document.querySelector('#clear');
let gridSize = 16;
let lastTouchSquare = null;

function createGrid(size) {
  gridSize = size;
  grid.textContent = '';
  lastTouchSquare = null;

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = 100 / size + '%';
    square.style.height = 100 / size + '%';
    square.setAttribute('data-visits', '0');
    square.addEventListener('mouseenter', function () {
      paintSquare(square);
    });
    grid.appendChild(square);
  }

  sizeLabel.textContent = size + ' × ' + size + ' grid';
}

function paintSquare(square) {
  let red = 41;
  let green = 79;
  let blue = 67;

  if (mode.value === 'rainbow' || mode.value === 'rainbow-darken') {
    red = Math.floor(Math.random() * 256);
    green = Math.floor(Math.random() * 256);
    blue = Math.floor(Math.random() * 256);
  } else if (mode.value === 'darken') {
    red = 255;
    green = 255;
    blue = 255;
  }

  if (mode.value === 'darken' || mode.value === 'rainbow-darken') {
    let visits = Number(square.getAttribute('data-visits'));
    if (visits < 10) {
      visits = visits + 1;
    }
    square.setAttribute('data-visits', visits);
    const brightness = 1 - visits / 10;
    red = Math.round(red * brightness);
    green = Math.round(green * brightness);
    blue = Math.round(blue * brightness);
  }

  square.style.backgroundColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}

function resizeGrid() {
  const input = prompt('Enter a whole number from 1 to 100:', gridSize);
  if (input === null) {
    return;
  }

  const size = Number(input);
  if (!Number.isInteger(size) || size < 1 || size > 100) {
    alert('Please enter a whole number between 1 and 100.');
    return;
  }
  createGrid(size);
}

function clearGrid() {
  createGrid(gridSize);
}

// Touch events provide a list of fingers. Use the first finger's position.
function paintTouch(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const square = document.elementFromPoint(touch.clientX, touch.clientY);

  if (square !== null && square.classList.contains('square')) {
    if (square !== lastTouchSquare) {
      paintSquare(square);
      lastTouchSquare = square;
    }
  }
}

function resetTouch() {
  lastTouchSquare = null;
}

resizeButton.addEventListener('click', resizeGrid);
clearButton.addEventListener('click', clearGrid);
mode.addEventListener('change', clearGrid);
grid.addEventListener('touchstart', paintTouch);
grid.addEventListener('touchmove', paintTouch);
grid.addEventListener('touchend', resetTouch);
grid.addEventListener('touchcancel', resetTouch);

createGrid(16);

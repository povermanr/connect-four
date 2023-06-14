const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1;
let board = [];
let animating = false;

function makeBoard() {
  board = [];

  for (let y = 0; y < HEIGHT; y++) {
    const rowData = [];

    for (let x = 0; x < WIDTH; x++) {
      rowData.push(null);
    }
    board.push(rowData);
  }
  makeHtmlBoard();
  return board;
}

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

const findSpotForCol = (x) => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
};

const placeInTable = (y, x, currPlayer) => {
  const piece = document.createElement('div');
  piece.className = `piece player${currPlayer}`;

  if (currPlayer === 1) {
    piece.classList.add('player1');
  } else if (currPlayer === 2) {
    piece.classList.add('player2');
  }

  const columnTopCell = document.getElementById(x.toString()); // Get the column top cell
  const columnTopRect = columnTopCell.getBoundingClientRect(); // Get the bounding rectangle of the column top cell

  const cell = document.getElementById(`${y}-${x}`); // Get the target cell
  const cellRect = cell.getBoundingClientRect(); // Get the bounding rectangle of the target cell

  const yDiff = cellRect.top - columnTopRect.bottom; // Calculate the vertical distance between the column top and the target cell

  animating = true;

  let animation = piece.animate(
    [
      { transform: `translateY(${-yDiff}px)`, offset: 0 }, // Start from above the column top
      { transform: 'translateY(0px)', offset: 0.8 }, // Move down to the target cell
      { transform: 'translateY(0px)', offset: 0.95 } // Move to the final position
    ],
    {
      duration: 1000,
      easing: 'linear',
      iterations: 1
    }
  );

  animation.addEventListener('finish', () => {
    if (checkForWin()) {
      endGame(currPlayer);
    } else if (checkForTie()) {
      noWinner('Tie');
    } else {
      currPlayer = currPlayer === 1 ? 2 : 1;
    }
  });

  cell.appendChild(piece); // Append the piece to the target cell
  board[y][x] = currPlayer;
};

const endGame = (winner) => {
  const winAlert = document.getElementById('win-alert');
  const winAlertMessage = document.getElementById('win-alert-message');
  winAlertMessage.textContent = `Player ${winner} Wins!`;
  winAlert.style.display = 'flex';
};

const noWinner = (tied) => {
  const winAlert = document.getElementById('win-alert');
  const winAlertMessage = document.getElementById('win-alert-message');
  winAlertMessage.textContent = `No moves left... ${tied}`;
  winAlert.style.display = 'flex';
};

const winAlert = document.getElementById('win-alert');
winAlert.addEventListener('click', () => {
  winAlert.style.display = 'none';
});

const checkForTie = () => {
  for (let row of board) {
    if (row.includes(null)) {
      return false; //at least 1 cell is still empty
    }
  }
  return true; //all cells are filled, it's a tie
};

const handleClick = (evt) => {
  let x = +evt.target.id;

  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  placeInTable(y, x, currPlayer);

  if (checkForWin()) {
    return endGame(currPlayer);
  }

  if (checkForTie()) {
    return noWinner('Tie');
  }

  currPlayer = currPlayer === 1 ? 2 : 1;
};

const checkForWin = () => {
  const _win = (cells) => {
    if (cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    )) {
      return true;
    }
    return false;
  };

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
  return false;
};

const newGameBtn = document.getElementById('new-game-btn');
newGameBtn.addEventListener('click', () => {
  const htmlBoard = document.getElementById('board');
  htmlBoard.innerHTML = '';
  makeBoard();
  const winAlert = document.getElementById('win-alert');
  winAlert.style.display = 'none';
});

makeBoard();

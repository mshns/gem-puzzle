// creating html elements

const container = document.createElement("div");
container.classList.add("container");
document.body.append(container);

const title = document.createElement("h1");
title.classList.add("title");
title.textContent = "Gem Puzzle";
container.append(title);

const control = document.createElement("div");
control.classList.add("control");
container.append(control);

const select = document.createElement("select");
const option3x3 = document.createElement("option");
const option4x4 = document.createElement("option");
const option5x5 = document.createElement("option");
const option6x6 = document.createElement("option");
const option7x7 = document.createElement("option");
const option8x8 = document.createElement("option");
option3x3.innerHTML = "3x3";
option3x3.setAttribute("value", 3);
option4x4.innerHTML = "4x4";
option4x4.setAttribute("value", 4);
option4x4.selected = true;
option5x5.innerHTML = "5x5";
option5x5.setAttribute("value", 5);
option6x6.innerHTML = "6x6";
option6x6.setAttribute("value", 6);
option7x7.innerHTML = "7x7";
option7x7.setAttribute("value", 7);
option8x8.innerHTML = "8x8";
option8x8.setAttribute("value", 8);
select.append(option3x3);
select.append(option4x4);
select.append(option5x5);
select.append(option6x6);
select.append(option7x7);
select.append(option8x8);
control.append(select);

const btnStart = document.createElement("button");
btnStart.classList.add("button");
btnStart.id = "start";
btnStart.innerHTML = "Shuffle/Start";
control.append(btnStart);

const btnSave = document.createElement("button");
btnSave.classList.add("button");
btnSave.innerHTML = "Save";
control.append(btnSave);

const btnResults = document.createElement("button");
btnResults.classList.add("button");
btnResults.innerHTML = "Results";
control.append(btnResults);

const btnSound = document.createElement("button");
btnSound.classList.add("button");
btnSound.innerHTML = "Sound";
control.append(btnSound);

const widget = document.createElement("div");
widget.classList.add("widget");
container.append(widget);

const time = document.createElement("div");
time.classList.add("time");
widget.append(time);

const moves = document.createElement("div");
moves.classList.add("moves");
widget.append(moves);

const template = document.createElement("div");
template.classList.add("template");
container.append(template);

// create an array with cell values

let cellsArray = [];
const empty = {};

function setArray(size) {
  cellsArray.length = 0;

  for (let i = 0; i < size ** 2; i++) {
    cellsArray[i] = i;
  }

  checkSolution(select.value);
}

setArray(select.value);

// изменение размера пазла

select.addEventListener("change", () => {
  setArray(select.value);
  count = 0;
  movesContainer.innerHTML = "Moves: " + count;
})

// проверка решаемости

function checkSolution(size) {
  cellsArray.sort(shuffle);
  let sum = 0;
  let row = 0;
  for (let i = 0; i < cellsArray.length; i++) {
    for (let j = i + 1; j < cellsArray.length; j++) {
      if (cellsArray[i] > cellsArray[j] && cellsArray[j] !== 0) {
        sum ++;
      }
    }
    if (cellsArray[i] === 0) {
      row = Math.ceil((i + 1) / size);
    }
  }
  if (size % 2 === 0) {
    if ((sum + row) % 2 === 0) {
      setPuzzle(cellsArray, select.value);
    } else {
      checkSolution(select.value);
    }
  } else {
    if (sum % 2 === 0) {
      setPuzzle(cellsArray, select.value);
    } else {
      checkSolution(select.value);
    }
  }
}

checkSolution();

function shuffle(a, b) {
  return 0.5 - Math.random();
}

// puzzle algorithm

function setPuzzle(cells, size) {
  template.innerHTML = "";

  for (let element in cells) {
    const cell = document.createElement("div");
    let left = (element % size) * 100 / size + '%';
    let top = Math.trunc(element / size) * 100 / size + '%';

    if (cells[element] !== 0) {
      cell.classList.add("cell");
      cell.style.left = left;
      cell.style.top = top;
      cell.style.width = 100 / size + '%';
      cell.style.height = 100 / size + '%';
      cell.innerHTML = cells[element];
      template.append(cell);
    } else {
      empty.left = left;
      empty.top = top;
    }
  }
}

document.querySelectorAll(".template").forEach(element => {
  element.addEventListener("click", cell => {
    if (Math.abs(parseInt(empty.left) - parseInt(cell.target.style.left)) + Math.abs(parseInt(empty.top) - parseInt(cell.target.style.top)) - Math.trunc(100 / select.value) < 2) {
      let x = cell.target.style.left;
      let y = cell.target.style.top;
      cell.target.style.left = empty.left;
      cell.target.style.top = empty.top;
      empty.left = x;
      empty.top = y;
      count++;
      movesContainer.innerHTML = "Moves: " + count;
    }

    let win = 0
    element.childNodes.forEach(e => {
      if (e.innerHTML == (parseInt(e.style.top) / parseInt(100 / select.value) * select.value + parseInt(e.style.left) / parseInt(100 / select.value) + 1)) {
        win++
      }
      if (win === select.value ** 2 - 1) alert('WIN!')
    });
  })
})

// moves

const movesContainer = document.querySelector(".moves");
let count = 0;
movesContainer.innerHTML = "Moves: " + count;

// time

const timeContainer = document.querySelector(".time");
timeContainer.innerHTML = "Time: 00:00";

// shuffle and start button

const buttonStart = document.getElementById("start");

buttonStart.addEventListener("click", () => {
  setArray(select.value);
  count = 0;
  movesContainer.innerHTML = "Moves: " + count;
})


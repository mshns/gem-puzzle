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
option5x5.innerHTML = "5x5";
option5x5.setAttribute("value", 5);
option6x6.innerHTML = "6x6";
option6x6.setAttribute("value", 6);
option7x7.innerHTML = "7x7";
option7x7.setAttribute("value", 7);
option8x8.innerHTML = "8x8";
option8x8.setAttribute("value", 8);

if (localStorage.getItem("gameSize")) {
  option3x3.selected = false;
  option4x4.selected = false;
  option5x5.selected = false;
  option6x6.selected = false;
  option7x7.selected = false;
  option8x8.selected = false;

  if (localStorage.gameSize === "3") option3x3.selected = true;
  if (localStorage.gameSize === "4") option4x4.selected = true;
  if (localStorage.gameSize === "5") option5x5.selected = true;
  if (localStorage.gameSize === "6") option6x6.selected = true;
  if (localStorage.gameSize === "7") option7x7.selected = true;
  if (localStorage.gameSize === "8") option8x8.selected = true;
} else {
  option4x4.selected = true;
}

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
btnSound.classList.add("button-sound");
btnSound.id = "sound";
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

const shadow = document.createElement("div");
shadow.classList.add("shadow");
document.body.append(shadow);

const popup = document.createElement("div");
popup.classList.add("popup");
document.body.append(popup);

const results = document.createElement("div");
results.classList.add("results");
document.body.append(results);

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

// time

const timeContainer = document.querySelector(".time");
let timer;
let count = 0;
let second = 0;

let seconds = ("0" + (second % 60)).slice(-2);
let minutes = ("0" + Math.floor(second / 60)).slice(-2);
timeContainer.innerHTML = "Time: " + minutes + ":" + seconds;

if (localStorage.getItem("gameState")) {
  template.innerHTML = localStorage.gameState;
  empty.left = JSON.parse(localStorage.empty).left;
  empty.top = JSON.parse(localStorage.empty).top;
  second = localStorage.timeCount;
  count = localStorage.movesCount;
  if (second != 0) {
    timer = setInterval(function () {
      seconds = ("0" + (second % 60)).slice(-2);
      minutes = ("0" + Math.floor(second / 60)).slice(-2);
      timeContainer.innerHTML = "Time: " + minutes + ":" + seconds;
      second++;
    }, 1000);
  }
} else {
  setArray(select.value);
}

// puzzle size

select.addEventListener("change", () => {
  setArray(select.value);
  count = 0;
  movesContainer.innerHTML = "Moves: " + count;
  clearInterval(timer);
  timeContainer.innerHTML = "Time: " + "00:00";
});

// solvable check

function checkSolution(size) {
  cellsArray.sort(shuffle);
  let sum = 0;
  let row = 0;
  for (let i = 0; i < cellsArray.length; i++) {
    for (let j = i + 1; j < cellsArray.length; j++) {
      if (cellsArray[i] > cellsArray[j] && cellsArray[j] !== 0) {
        sum++;
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

function shuffle(a, b) {
  return 0.5 - Math.random();
}

// puzzle algorithm

function setPuzzle(cells, size) {
  template.innerHTML = "";

  for (let element in cells) {
    const cell = document.createElement("div");
    let left = ((element % size) * 100) / size + "%";
    let top = (Math.trunc(element / size) * 100) / size + "%";

    if (cells[element] !== 0) {
      cell.classList.add("cell");
      cell.setAttribute("draggable", true);
      cell.style.left = left;
      cell.style.top = top;
      cell.style.width = 100 / size + "%";
      cell.style.height = 100 / size + "%";
      cell.innerHTML = cells[element];
      template.append(cell);
    } else {
      cell.classList.add("cell-empty");
      cell.style.left = left;
      cell.style.top = top;
      cell.style.width = 100 / size + "%";
      cell.style.height = 100 / size + "%";
      template.append(cell);
      empty.left = left;
      empty.top = top;
    }
  }
}

document.querySelectorAll(".template").forEach((element) => {
  element.addEventListener("click", (cell) => {
    if (
      Math.abs(parseInt(empty.left) - parseInt(cell.target.style.left)) +
        Math.abs(parseInt(empty.top) - parseInt(cell.target.style.top)) -
        Math.trunc(100 / select.value) <
      2
    ) {
      playAudio(0);
      let x = cell.target.style.left;
      let y = cell.target.style.top;
      cell.target.style.left = empty.left;
      cell.target.style.top = empty.top;
      empty.left = x;
      empty.top = y;
      document.querySelector(".cell-empty").style.left = x;
      document.querySelector(".cell-empty").style.top = y;
      count++;

      if (count === 1) {
        second = 1;
        timeContainer.innerHTML = "Good luck!";
        timer = setInterval(function () {
          seconds = ("0" + (second % 60)).slice(-2);
          minutes = ("0" + Math.floor(second / 60)).slice(-2);
          timeContainer.innerHTML = "Time: " + minutes + ":" + seconds;
          second++;
        }, 1000);
      }
      movesContainer.innerHTML = "Moves: " + count;
    }

    let win = 0;
    element.childNodes.forEach((e) => {
      if (
        e.innerHTML ==
        (parseInt(e.style.top) / parseInt(100 / select.value)) * select.value +
          parseInt(e.style.left) / parseInt(100 / select.value) +
          1
      ) {
        win++;
      }
      if (win === select.value ** 2 - 1) {
        clearInterval(timer);
        playAudio(1);

        let steps = "ходов";
        if (count % 10 === 1) {
          steps = "ход";
        } else if (count % 10 === 2 || count % 10 === 3 || count % 10 === 4) {
          steps = "хода";
        }

        if (isPlay)
          speechSynthesis.speak(
            new SpeechSynthesisUtterance(
              `Поздравляю, Вы собрали пазл за ${count} ${steps}`
            )
          );
        popup.innerHTML = `Ура! Вы решили головоломку<br>за ${minutes}:${seconds} и ${count} ${steps}!`;

        shadow.classList.add("active");
        popup.classList.add("active");
        resultsArray.push({
          moves: count,
          time: second - 1,
          size: select.value,
        });
        setLocalStorage("results", JSON.stringify(resultsArray));
      }
    });
  });

  // drag and drop

  element.addEventListener("dragstart", (cell) => {
    if (
      Math.abs(parseInt(empty.left) - parseInt(cell.target.style.left)) +
        Math.abs(parseInt(empty.top) - parseInt(cell.target.style.top)) -
        Math.trunc(100 / select.value) <
      2
    ) {
      setTimeout(() => {
        cell.target.classList.add("hidden");
      }, 0);
      document.querySelector(".cell-empty").classList.add("active");
    }
  });

  element.addEventListener("dragover", (cell) => {
    if (cell.target.classList.contains("cell-empty")) {
      cell.preventDefault();
    }
  });

  element.addEventListener("dragend", (cell) => {
    if (
      Math.abs(parseInt(empty.left) - parseInt(cell.target.style.left)) +
        Math.abs(parseInt(empty.top) - parseInt(cell.target.style.top)) -
        Math.trunc(100 / select.value) <
      2
    ) {
      cell.target.classList.remove("hidden");
      playAudio(0);
      let x = cell.target.style.left;
      let y = cell.target.style.top;
      cell.target.style.left = empty.left;
      cell.target.style.top = empty.top;
      empty.left = x;
      empty.top = y;
      document.querySelector(".cell-empty").style.left = x;
      document.querySelector(".cell-empty").style.top = y;
      count++;

      if (count === 1) {
        second = 1;
        timeContainer.innerHTML = "Good luck!";
        timer = setInterval(function () {
          seconds = ("0" + (second % 60)).slice(-2);
          minutes = ("0" + Math.floor(second / 60)).slice(-2);
          timeContainer.innerHTML = "Time: " + minutes + ":" + seconds;
          second++;
        }, 1000);
      }
      movesContainer.innerHTML = "Moves: " + count;
      document.querySelector(".cell-empty").classList.remove("active");
    }

    let win = 0;
    element.childNodes.forEach((e) => {
      if (
        e.innerHTML ==
        (parseInt(e.style.top) / parseInt(100 / select.value)) * select.value +
          parseInt(e.style.left) / parseInt(100 / select.value) +
          1
      ) {
        win++;
      }
      if (win === select.value ** 2 - 1) {
        clearInterval(timer);
        playAudio(1);

        let steps = "ходов";
        if (count % 10 === 1) {
          steps = "ход";
        } else if (count % 10 === 2 || count % 10 === 3 || count % 10 === 4) {
          steps = "хода";
        }
        if (isPlay)
          speechSynthesis.speak(
            new SpeechSynthesisUtterance(
              `Поздравляю, Вы собрали пазл за ${count} ${steps}`
            )
          );
        popup.innerHTML = `Ура! Вы решили головоломку<br>за ${minutes}:${seconds} и ${count} ${steps}!`;
        shadow.classList.add("active");
        popup.classList.add("active");
        resultsArray.push({
          moves: count,
          time: second - 1,
          size: select.value,
        });
        setLocalStorage("results", JSON.stringify(resultsArray));
      }
    });
  });
});

// moves

const movesContainer = document.querySelector(".moves");
movesContainer.innerHTML = "Moves: " + count;

// shuffle and start button

btnStart.addEventListener("click", () => {
  setArray(select.value);
  count = 0;
  movesContainer.innerHTML = "Moves: " + count;
  clearInterval(timer);
  timeContainer.innerHTML = "Time: " + "00:00";
});

// sound

let isPlay = true;

const sounds = [
  {
    title: "move",
    src: "./assets/move.mp3",
  },
  {
    title: "win",
    src: "./assets/win.mp3",
  },
];

const audio = new Audio();
function playAudio(sound) {
  if (isPlay) {
    audio.src = sounds[sound].src;
    audio.play();
  }
}

btnSound.addEventListener("click", () => {
  isPlay ? (isPlay = false) : (isPlay = true);
  btnSound.classList.toggle("button-sound");
});

// popup shadow

shadow.addEventListener("click", () => {
  shadow.classList.remove("active");
  popup.classList.remove("active");
  results.classList.remove("active");
});

// results

btnResults.addEventListener("click", () => {
  results.innerHTML = "";

  const subtitle = document.createElement("h2");
  subtitle.classList.add("subtitle");
  subtitle.textContent = "Results";
  results.append(subtitle);

  const ol = document.createElement("ol");
  for (let i = 0; i < 10; i++) {
    const li = document.createElement("li");
    li.classList.add("results-item");
    if (resultsArray[i]) {
      li.textContent =
        " Moves: " +
        resultsArray.sort(topResults)[i].moves +
        " ◾ Time: " +
        resultsArray[i].time +
        " ◾ Size: " +
        resultsArray[i].size;
    }
    ol.append(li);
  }
  results.append(ol);

  shadow.classList.add("active");
  results.classList.add("active");
});

// save

let resultsArray = [];
if (localStorage.getItem("results")) {
  resultsArray = JSON.parse(localStorage.results);
}

function topResults(a, b) {
  return a.moves > b.moves ? 1 : -1;
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function getLocalStorage(key) {
  if (localStorage.getItem(key)) {
    key.value = localStorage.getItem(key);
  }
}

btnSave.addEventListener("click", () => {
  clearInterval(timer);
  setLocalStorage("movesCount", count);
  if (count === 0) second = 0;
  setLocalStorage("timeCount", second);
  setLocalStorage("gameSize", select.value);
  setLocalStorage("gameState", template.innerHTML);
  setLocalStorage("empty", JSON.stringify(empty));
});

// score

console.log(
  "Contacts:\n",
  "📧 Discord: mishanos#6940\nhttps://discordapp.com/users/561035807046238209\n",
  "📧 Telegram: @msh_ns\nhttps://t.me/msh_ns\n\n",

  "📂 Score: 120 / 120\n\n",

  "✅ [+30] Basic scope\n",
  "✔️ Layout, design, responsive UI [+10]\n",
  "✔️ At the beginning state of the game, the frame is filled with randomly generated and shuffled numbers [+10]\n",
  "✔️ On click on a tile next to an empty cell, the tile moves to the empty cell [+10]\n\n",

  "✅ [+50] Advanced scope\n",
  "✔️ The game can be restarted without reloading the page [+10]\n",
  "✔️ Game duration and number of moves are displayed [+10]\n",
  "✔️ Sound accompaniment (on/off) of tiles movement [+10]\n",
  "✔️ Implemented saving the state of the game and saving the top 10 results using LocalStorage [+10]\n",
  "✔️ Implemented selection of different sizes for frame [+10]\n\n",

  "✅ [+40] Hacker scope\n",
  "✔️ When the game is finished, the following message is displayed `Hooray! You solved the puzzle in ##:## and N moves!`. Shuffled algorithm work correctly - user can solve puzzle [+10]\n",
  "✔️ Animation of tiles' movement on frame [+15]\n",
  "✔️ Tiles can be dragged with use of mouse [+15]"
);
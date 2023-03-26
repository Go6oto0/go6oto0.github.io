//
// Minesweeper Script file
//
var x;
var y;
var minesCount;
var undiscoveredMines;
var goldCount = 0;
var remainingFlags;
var health;
var radarCount = 0;
var minefield = [];
var lockGame = false;
var timerEl, minefieldEl;
var level = "rock";

window.addEventListener("load", function () {init(level);})
function init(preset)
{
  startTimer();
  minefieldEl = document.querySelector("#minefield");

  if (preset == "rock") {
    x = 10;
    y = 10;
    minesCount = 30;
    undiscoveredMines = minesCount;
    health = 100;
    remainingFlags = 25;
    }

    //Generating Minefield
    let minefieldRowStyle = "";
    let minefieldColumnStyle = "";
    let isColumnAdded = false;
    console.log("starting generation");
    for (var i = 0; i < x; i++) {
        minefieldRowStyle += "60px ";

        for (var j = 0; j < y; j++) {
            if (!isColumnAdded) {
                minefieldColumnStyle += "60px ";
            }
            var rowEl = document.createElement("div");
            rowEl.classList.add("row");
            var cellEl = document.createElement("div")
            cellEl.classList.add("cell");
            rowEl.appendChild(cellEl)
            minefieldEl.appendChild(rowEl);
        }
        isColumnAdded = true;
    }
    minefieldEl.style.gridTemplateRows = minefieldRowStyle;
    minefieldEl.style.gridTemplateColumns = minefieldColumnStyle;
}
function startTimer()
{
    timerEl = document.querySelector("#topbar-time .label__text");
    timerEl.innerHTML = `00 : 00`
  let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
  let int = null;
  if (int !== null) {
    clearInterval(int);
  }
  int = setInterval(displayTimer, 10);
  function displayTimer() {
    milliseconds += 10;
    if (milliseconds == 1000) {
      milliseconds = 0;
      seconds++;
      if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes == 60) {
          minutes = 0;
          hours++;
        }
      }
    }
    let h = hours < 10 ? `0` + hours : hours;
    let m = minutes < 10 ? `0` + minutes : minutes;
    let s = seconds < 10 ? `0` + seconds : seconds;
    let ms =
      milliseconds < 10
        ? `00` + milliseconds
        : milliseconds < 100
        ? `0` + milliseconds
        : milliseconds;
    timerEl.innerHTML = `${m} : ${s}`;
  }
}
function cell(row, column)
{
    var selector = 'div[data-x="' + column + '"][data-y="' + row + '"]';
    var cellObj = {};
    cellObj.content ='<div class="cell" data-x="' +column + '" data-y="' + row +'"></div>';
    cellObj.isMine = false;
    cellObj.isRevealed = false;
    cellObj.isFlagged = false;
    cellObj.nearMines = 0;
    cellObj.cellType = "normal"; // "sidesOnly"
    cellObj.x = column;
    cellObj.y = row;
    cellObj.visited = false;
    cellObj.value = document.querySelector(selector);
    //cellObj.isInfected = false;
    //cellObj.hasImunity = false;
    cellObj.hover = function (isHovered) {
        if (isHovered) {
            value.addClass("hover");
        } else {
            value.removeClass("hover");
        }
    };
}
/*
window.addEventListener("load", (event) => {
    //body.addEventListener("click", () => {
    //    var allTileEl = document.querySelectorAll(".cell-tile");
    //    allTileEl.forEach((el) => {
    //        if (el.classList.contains("rock-type")) {
    //            el.classList.replace("rock-type", "crystal-type");
    //        }
    //        else if (el.classList.contains("crystal-type")) {
    //            el.classList.replace("crystal-type", "lava-type");
    //        }
    //        else if (el.classList.contains("lava-type")) {
    //            el.classList.replace("lava-type", "dungeon-type");
    //        }
    //        else if (el.classList.contains("dungeon-type")) {
    //            el.classList.replace("dungeon-type", "rock-type");
    //        }
            
    //    })
    //})
});

*/

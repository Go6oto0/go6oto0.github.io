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
var maxHealth = 100;
var inventory = { radarCount: 0 };
var minefield = [[],[]];
var lockGame = false;
var timerEl, minefieldEl;
var level = "rock"; // level preset, do not change for demo


function init(level) {
    minefieldEl = document.querySelector("#minefield");
    if (level == "rock") {
        x = 10;
        y = 10;
        minesCount = 30;
        undiscoveredMines = minesCount;
        health = 100;
        remainingFlags = 25;
    }
    setUICounters();
    let minefieldRowStyle = "";
    let minefieldColumnStyle = "";
    let isColumnAdded = false;
    for (var i = 0; i < x; i++) {
        minefieldRowStyle += "60px ";
        minefield.push([]);
        for (var j = 0; j < y; j++) {
            if (!isColumnAdded) {
                minefieldColumnStyle += "60px ";
            }
            var cellEl = document.createElement("div");
            cellEl.classList.add("cell");
            cellEl.setAttribute("data-x", i);
            cellEl.setAttribute("data-y", j);
            minefieldEl.appendChild(cellEl);
            minefield[i][j] = cell(i, j);
            
        }
        isColumnAdded = true;
    }
    minefieldEl.style.gridTemplateRows = minefieldRowStyle;
    minefieldEl.style.gridTemplateColumns = minefieldColumnStyle;
}
function cell(row, column) {
    var selector = 'div[data-x="' + row + '"][data-y="' + column + '"]';
    var cellObj = {};
    cellObj.content = '<div class="cell" data-x="' + row + '" data-y="' + column + '"></div>';
    cellObj.isMine = false;
    cellObj.isRevealed = false;
    cellObj.isFlagged = false;
    cellObj.nearMines = 0;
    cellObj.cellType = "normal"; // "sidesOnly"
    cellObj.x = row;
    cellObj.y = column;
    cellObj.visited = false;
    cellObj.El = document.querySelector(selector);
    //cellObj.isInfected = false;
    //cellObj.hasImunity = false;
    cellObj.hover = function (isHovered) {
        if (isHovered) {
            El.addClass("hover");
        } else {
            El.removeClass("hover");
        }
    };

    return cellObj;
}



window.addEventListener("load", function () {

    document.querySelector("body").addEventListener("click", function (ev) {
        let cellEl = ev.target.closest(".cell")
        if (cellEl) {
            console.log("left click x is: " + cellEl.dataset.x);
            console.log("left click y is: " + cellEl.dataset.y);
        }
    })

    document.querySelector("body").addEventListener("contextmenu", function (ev) {
        ev.preventDefault();
        let cellEl = ev.target.closest(".cell")
        if (cellEl) {
            var x = cellEl.dataset.x, y = cellEl.dataset.y;
            if (minefield[x][y].isFlagged == 0) {
                minefield[x][y].isFlagged = 1;
                minefield[x][y].El.classList.add("flag");
            }
            else {
                minefield[x][y].isFlagged = 0;
                minefield[x][y].El.classList.remove("flag");
            }
            console.log("right click x is: " + cellEl.dataset.x);
            console.log("right click y is: " + cellEl.dataset.y);
        }
    })

    init(level);
    /*for (var i = 0; i < minefield.length; i++) {
        var ell = minefield[i];
        for (var j = 0; j < ell.length; j++) {
            console.log("minefield[" + i + "][" + j + "] = " + ell[j]);
        }
    }*/
})


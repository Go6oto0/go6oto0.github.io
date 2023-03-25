//
// Minesweeper Script file
//
var x = 10;
var y = 10;
var minesCount = 30;
var undiscoveredMines = minesCount;
var minefield = [];
var lockGame = false;

function cell(row, column)
{
    var selector = 'div[data-x="' + column + '"][data-y="' + row + '"]';
    var cellObj = {};
    cellObj.content = '<div class="cell" data-x="' + column + '" data-y="' + row + '"><span class="nearMines">0</span><span class="mine"></span><span class="flag"></span></div>';
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
    cellObj.hover = function (isHovered)
    {
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
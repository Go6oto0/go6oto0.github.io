//
// Minesweeper Script file
//

var x;
var y;
var minesCount;
var chestCount;
var undiscoveredMines;
var goldCount = 0;
var remainingFlags;
var health;
var maxHealth = 100;
var inventory = { radarCount: 0 };
var minefield = [[], []];
var lockGame = false;
var isFullScreen = false;
var timerEl, minefieldEl, fullscreenLinkEl;
var level = "rock"; // level preset, do not change for demo
var fireflyCount = 15; //max 15

function revealedCheck() {
    console.log(`Revealed:`)
    for (let i = 0; i < x; i++) {
        let tempArr = minefield[i];
        let resultArr = [];
        tempArr.forEach((x) => resultArr.push(x.isRevealed ? 1 : 0))
        console.log(resultArr.join(` `));
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function init(level) {
    minefieldEl = document.querySelector("#minefield");
    if (level == "rock") {
        x = 10;
        y = 10;
        chestCount = 5;
        minesCount = 30;
        undiscoveredMines = minesCount;
        health = 100;
        remainingFlags = 30;
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


    addBombs();
    console.log(`Bombs:`)
    for (let i = 0; i < x; i++) {
        let tempArr = minefield[i];
        let resultArr = [];
        tempArr.forEach((x) => resultArr.push(x.isMine))
        console.log(resultArr.join(` `));
    }

    countAdjacentMines();
    console.log(`Adjacent mines:`)
    for (let i = 0; i < x; i++) {
        let tempArr = minefield[i];
        let resultArr = [];
        tempArr.forEach((x) => resultArr.push(x.nearMines))
        console.log(resultArr.join(` `));
    }

    countAdjacentMinesSidesOnly()
    console.log(`Adjacent mines (sides only):`)
    for (let i = 0; i < x; i++) {
        let tempArr = minefield[i];
        let resultArr = [];
        tempArr.forEach((x) => resultArr.push(x.nearMinesSides))
        console.log(resultArr.join(` `));
    }

    addChest();
    console.log(`Chests:`)
    for (let i = 0; i < x; i++) {
        let tempArr = minefield[i];
        let resultArr = [];
        tempArr.forEach((x) => resultArr.push(x.isChest ? 1 : 0))
        console.log(resultArr.join(` `));
    }

    minefieldEl.style.gridTemplateRows = minefieldRowStyle;
    minefieldEl.style.gridTemplateColumns = minefieldColumnStyle;
}
function cell(row, column) {
    var selector = 'div[data-x="' + row + '"][data-y="' + column + '"]';
    var cellObj = {};
    cellObj.content = '<div class="cell" data-x="' + row + '" data-y="' + column + '"></div>';
    cellObj.isMine = 0; // normal - 0; bomb - 1; special bomb - 2
    cellObj.isChest = 0; // normal - 0; gold - 1; radar - 2 ...
    cellObj.isRevealed = false;
    cellObj.isFlagged = false;
    cellObj.nearMines = 0;
    cellObj.nearMinesSides = 0;
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

function openFullscreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
    fullscreenLinkEl.classList.add("on");
    isFullScreen = true;
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
    fullscreenLinkEl.classList.remove("on");
    isFullScreen = false;
}

function enbledBackgroundMovement() {
    var movementStrength = 25;
    var height = movementStrength / window.innerHeight;
    var width = movementStrength / window.innerWidth;
    var wrapperEl = document.getElementById("minefield-wrapper");
    wrapperEl.addEventListener("mousemove", function (e) {
        var pageX = e.pageX - (window.innerWidth / 2);
        var pageY = e.pageY - (window.innerHeight / 2);
        var newvalueX = width * pageX * -1 - 25;
        var newvalueY = height * pageY * -1 - 50;
        wrapperEl.style.backgroundPosition = "calc(50% - " + newvalueX + "px) " + "calc(50% - " + newvalueY + "px)";
    });
}

function insertFireflies() {
    for (var i = 0; i < fireflyCount; i++) {
        var fireflyEl = document.createElement("div");
        fireflyEl.classList.add("firefly");
        document.body.appendChild(fireflyEl);
    }
}

function animateMinefieldInit() {
    document.getElementById("minefield").querySelectorAll(".cell").forEach(function (item, index) {
        // stagger transition with transitionDelay
        console.log(index);
        item.style.transitionDelay = (index * 25) + 'ms';
        item.classList.toggle('is-moved');
    });
}

window.addEventListener("load", function () {

    // Init
    ///////////////////////
    fullscreenLinkEl = document.getElementById("topbar-fullscreen");
    init(level); //First so if global variable is used in the listeners, than it will be initialized


    // Listeners
    ///////////////////////
    document.querySelector("body").addEventListener("click", function (ev) {
        let cellEl = ev.target.closest(".cell")
        if (cellEl) {
            var x = cellEl.dataset.x, y = cellEl.dataset.y;
            let current = minefield[x][y];
            if (current.isRevealed == false && current.isFlagged == false) {
                cellTypeCheck(current);
            }
            revealedCheck();
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
                remainingFlags--;
                setFlags();
            }
            else {
                minefield[x][y].isFlagged = 0;
                minefield[x][y].El.classList.remove("flag");
                remainingFlags++;
                setFlags();
            }

            console.log("right click x is: " + cellEl.dataset.x);
            console.log("right click y is: " + cellEl.dataset.y);
        }
    })

    fullscreenLinkEl.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (!isFullScreen) {
            openFullscreen();
        }
        else {
            closeFullscreen();
        }
    })

    document.getElementById("topbar").addEventListener("dblclick", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (!isFullScreen) {
            openFullscreen();
        }
        else {
            closeFullscreen();
        }
    })

    // Effects
    ///////////////////////////
    enbledBackgroundMovement();
    insertFireflies();

    //place cells on board
    //setTimeout(() => { animateMinefieldInit();}, 100);



    /*for (var i = 0; i < minefield.length; i++) {
        var ell = minefield[i];
        for (var j = 0; j < ell.length; j++) {
            console.log("minefield[" + i + "][" + j + "] = " + ell[j]);
        }
    }*/
})

function addBombs() {
    let bombsToAdd = undiscoveredMines;
    while (bombsToAdd > 0) {
        let row = Math.floor(Math.random() * (x));
        let col = Math.floor(Math.random() * (y));
        let currentBomb = minefield[row][col];
        if (currentBomb.isMine === 0) {
            let bombType = Math.floor(Math.random() * 2) + 1;
            currentBomb.isMine = bombType;
            bombsToAdd--;
        } else {
            console.log(`This cell is a mine`);
        }
    }
}

function addChest() {
    let chestsToAdd = chestCount;
    while (chestsToAdd > 0) {
        let row = Math.floor(Math.random() * (x));
        let col = Math.floor(Math.random() * (y));
        let currentChest = minefield[row][col];
        if (currentChest.isChest == 0) {
            if (currentChest.isMine === 0) {
                let chestType = Math.floor(Math.random() * 2) + 1;
                currentChest.isChest = chestType;
                chestsToAdd--;
            }
        } else {
            console.log(`This cell is a chest`);
        }
    }
}

function countAdjacentMines() {
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            var minesCount = 0;
            let current = minefield[i][j];
            if (current.isMine == false) {
                for (let row = i - 1; row <= i + 1; row++) {
                    for (let col = j - 1; col <= j + 1; col++) {
                        // check if the adjacent cell is within the grid bounds
                        if (row >= 0 && row < y && col >= 0 && col < x) {
                            // check if the adjacent cell contains a mine
                            if (minefield[row][col].isMine) {
                                minesCount++;
                            }
                        }
                    }
                }
                current.nearMines = minesCount;
            }
        }
    }
}

function countAdjacentMinesSidesOnly() {
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            var minesCount = 0;
            let current = minefield[i][j];
            if (current.isMine == false) {
                for (let row = i - 1; row <= i + 1; row++) {
                    for (let col = j - 1; col <= j + 1; col++) {

                        if ((row == i - 1 && col == j) || (row == i + 1 && col == j) || (row == i && col == j + 1) || (row == i && col == j - 1)) {
                            if (row >= 0 && row < y && col >= 0 && col < x) {

                                if (minefield[row][col].isMine) {
                                    minesCount++;
                                }
                            }
                        }
                    }
                }
                current.nearMinesSides = minesCount;
            }
        }
    }
}

function revealAll() {
    minefield.forEach((x) => x.forEach((y) => y.isRevealed = true));
}

function gameOver() {
    //TO DO
}

function winGame() {
    //TO DO
}

function cellTypeCheck(current) {
    if (current.isMine) {
        if (current.bombType === 1) {
            minefield[x][y].El.classList.add("blackmine");
        }
        minesCount--;
        setBombs();
        let bombType = current.isMine;
        if (bombType === 1) {
            health -= 35;
        } else if (bombType === 2) {
            health -= 50;
        }
        current.isMine = false;
        if (health <= 0) {
            health = 0;
            revealAll();
            console.log(`Game over!`)
            stopTimer();
        }
        setHealth();
    } else {
        current.isRevealed = true;
        if (current.isChest) {
            if (current.isChest === 1) {
                goldCount += Math.round(getRandomInt(10000, 100000) / 1000) * 1000;
                setGold();
            } else {
                inventory.radarCount++;
                setRadars();
            }
        }

        //To do
    }
}
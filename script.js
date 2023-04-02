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

function init(level) {
    minefieldEl = document.querySelector("#minefield");
    if (level == "rock") {
        x = 11;
        y = 20;
        chestCount = 100;
        minesCount = 40;
        undiscoveredMines = minesCount;
        health = 100;
        remainingFlags = 40;
    }
    setUICounters();
    /*disableInspect();*/ //Disabling inspect
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

    minefieldSetup();
    normalOrSidesOnly();
    
    minefieldEl.style.gridTemplateRows = minefieldRowStyle;
    minefieldEl.style.gridTemplateColumns = minefieldColumnStyle;
}
function cell(row, column) {
    var selector = 'div[data-x="' + row + '"][data-y="' + column + '"]';
    var cellObj = {};
    cellObj.content = '<div class="cell" data-x="' + row + '" data-y="' + column + '"></div>';
    cellObj.isMine = 0; // normal - 0; bomb - 1; special bomb - 2
    cellObj.isChest = 0; // normal - 0; gold - 1; radar - 2; health - 3; time - 4...
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
    minefieldEl.querySelectorAll(".cell").forEach(function (item, index) {
        // stagger transition with transitionDelay
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
        if (cellEl && lockGame == false) {
            var x = cellEl.dataset.x, y = cellEl.dataset.y;
            let current = minefield[x][y];
            if (current.isRevealed == false && current.isFlagged == false) {
                cellTypeCheck(current);
            } else if (current.isRevealed && current.isChest) {
                current.visited = true;
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
        if (cellEl && lockGame == false) {
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
    setTimeout(() => { animateMinefieldInit();}, 1);



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
            if (bombType === 1) {
                currentBomb.El.classList.add("blackmine");
            } else {
                currentBomb.El.classList.add("redmine");
            }
            bombsToAdd--;
        } else {
            console.log(`This cell is a mine`);
        }
    }
}

function addChest() {
    if (countEmptyCells() < chestCount) {
        chestCount = countEmptyCells();
    }
    let chestsToAdd = chestCount;
    while (chestsToAdd > 0) {
        let row = Math.floor(Math.random() * (x));
        let col = Math.floor(Math.random() * (y));
        let currentChest = minefield[row][col];
        if (currentChest.isChest == 0) {
            if (currentChest.isMine === 0 && currentChest.nearMines === 0) {
                let chestType = Math.floor(Math.random() * 4) + 1;
                currentChest.isChest = chestType;
                currentChest.El.classList.add("chest");
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
                        if (row >= 0 && row < x && col >= 0 && col < y) {
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
                            if (row >= 0 && row < x && col >= 0 && col < y) {

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

function normalOrSidesOnly() {
    for (let row = 0; row < x; row++) {
        for (let col = 0; col < y; col++) {
            let chanceSides = getRandomWithFrequency(40)// 40 percent to return 1, otherwise 2
            let current = minefield[row][col];
            if (current.nearMinesSides == 0) {
                setnormalcounter(current);
            }
            else {
                if (chanceSides == 1) setsidescounter(current);
                else {
                    setnormalcounter(current);
                }
            }
        }
    }
}

function revealAll() {
    minefield.forEach((x) => x.forEach((y) => { y.isRevealed = true; cellTypeCheck(y); }));
}

function gameOver() {
    revealAll();
    console.log(`Game over!`)
    stopTimer();
    lockGame = true;
    //TO DO
}

function winGame() {
    //TO DO
}
function RevealNearby(xi, yi) {
    if (0 > xi || xi >= x || 0 > yi || yi >= y) return;
    current = minefield[xi][yi];
    if (current.isRevealed == true) return;
    current.El.classList.add("revealed");
    current.isRevealed = true;
    if (current.nearMines == 0) { // empty cell or chest cell
        
        RevealNearby(xi - 1, yi);
        RevealNearby(xi + 1, yi);
        RevealNearby(xi, yi - 1);
        RevealNearby(xi, yi + 1);
    }
    return; // if a numbered cell, the recursion stops
}
function cellTypeCheck(current) {
    if (current.isMine == 0 && current.nearMines == 0) {
        console.log("Recursion starts");
        RevealNearby(current.x, current.y);
    }
    current.El.classList.add("revealed");
    current.isRevealed = true;
    if (current.isMine > 0) {
        minesCount--;
        setBombs();
        let bombType = current.isMine;
        if (bombType === 1) {
            health -= 35;
        } else if (bombType === 2) {
            health -= 50;
        }
        current.isMine = 0;
        if (health <= 0) {
            health = 0;
            gameOver();
        }
        setHealth();

    } else if (current.isChest && current.visited) {
        if (current.isChest === 1) {
            goldCount += Math.round(getRandomInt(10000, 100000) / 1000) * 1000;
            current.El.classList.add(`points`);
            setGold();
        } else if (current.isChest === 2) {
            current.El.classList.add(`radar`);
            inventory.radarCount++;
            setRadars();
        } else if (current.isChest === 3) {
            current.El.classList.add(`hearth`);
            health += 25;
            if (health > 100) {
                health = 100;
            }
            setHealth();
        } else if (current.isChest === 4) {
            current.El.classList.add(`time`);
            if (timeInSeconds - 20 < 0) {
                timeInSeconds = 0;
            } else {
                timeInSeconds -= 20;
            }
            specialEffect = true;
        }

        //To do
    }
}

function disableInspect() {
    console.log(`disable inspect`)
    document.onkeydown = function (e) {
         
        // disable F12 key
        if (e.keyCode == 123) {
            return false;
        }

        // disable I key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
            return false;
        }

        // disable J key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
            return false;
        }

        // disable U key
        if (e.ctrlKey && e.keyCode == 85) {
            return false;
        }
    }
}

function minefieldSetup() {
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

}

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

function getRandomWithFrequency(frequncy) {
    let random = getRandomInt(0, 100);
    frequncy = 100 - frequncy;
    if (random >= frequncy) {
        return 1;
    } else {
        return 2;
    }
}

function setnormalcounter(current) {
    current.cellType = `normal`;
    if (current.nearMines === 1) {
        current.El.classList.add("number1");
    } else if (current.nearMines === 2) {
        current.El.classList.add("number2");
    } else if (current.nearMines === 3) {
        current.El.classList.add("number3");
    } else if (current.nearMines === 4) {
        current.El.classList.add("number4");
    } else if (current.nearMines === 5) {
        current.El.classList.add("number5");
    } else if (current.nearMines === 6) {
        current.El.classList.add("number6");
    } else if (current.nearMines === 7) {
        current.El.classList.add("number7");
    } else if (current.nearMines === 8){
        current.El.classList.add("number8");
    }
}

function setsidescounter(current) {
    current.cellType = `sidesOnly`;
    if (current.nearMinesSides === 1) {
        current.El.classList.add("number1sides");
    } else if (current.nearMinesSides === 2) {
        current.El.classList.add("number2sides");
    } else if (current.nearMinesSides === 3) {
        current.El.classList.add("number3sides");
    } else if (current.nearMinesSides === 4) {
        current.El.classList.add("number4sides");
    }
}

function countEmptyCells() {
    let count = 0;
    minefield.forEach((x) => x.forEach((y) => {
        if (y.nearMines == 0 && y.isMine == false) {
            count++;
        }
    }));
    return count;
}
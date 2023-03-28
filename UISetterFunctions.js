//
// UI Setter and Timer Functions
//

function startTimer() {
    timerEl = document.querySelector("#topbar-time .label__text");
    timerEl.innerHTML = `00:00`;
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
        timerEl.innerHTML = `${m}:${s}`;
    }
}
function setGold() {
    var score_El = document.querySelector("#topbar-score .label__text");
    score_El.innerHTML = goldCount.toString().padStart(9, '0');
}
function setBombs() {
    let bombs_El = document.querySelector(`#topbar-bombs .label__text--x`);
    bombs_El.innerHTML = minesCount.toString().padStart(2, '0');
}
function setFlags() {
    let flags_El = document.querySelector(`#topbar-flags .label__text--x`);
    flags_El.innerHTML = remainingFlags.toString().padStart(2, '0');
}
function setRadars() {
    let radars_El = document.querySelector(`#radar .label__text--x`);
    radars_El.innerHTML = inventory.radarCount.toString().padStart(1, '0');
}
function setHealth() {
    let healthValue_El = document.querySelector(`#footer-health .label__text`);
    healthValue_El.innerHTML = health.toString();
    let healthProgress_El = document.querySelector(`#footer-health .label__fill`);
    healthProgress_El.style.width = health / maxHealth * 100 + "%";
}
function setUICounters() {
    startTimer();
    setHealth();
    setGold();
    setBombs();
    setFlags();
    setRadars();
}
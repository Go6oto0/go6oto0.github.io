
// document / window
//First developer Viktor
//Second developer: Nikola
//third row
//forth row
let bodyEl;
let divEl;
let linkEl;
let containerEl;

function addDiv() {
    let addedDivEl = document.createElement("div");
    containerEl.appendChild(addedDivEl);
}

function init() {
    bodyEl = document.getElementById("body");
    divEl = document.getElementById("div");
    linkEl = document.getElementById("link");
    containerEl = document.getElementById("container");


    bodyEl.addEventListener("click", function (event) {
        if (event.target.tagName.toLowerCase() === "div") {
            console.log("div clicked");
        }
    });

    divEl.addEventListener("click", function (event) {
        console.log("div clicked");
    });



    linkEl.addEventListener("click", function (event) {
        //Add div to container
        event.preventDefault();
        event.stopPropagation();
        addDiv();
    });

    window.addEventListener("resize", function (e) {
        console.log(e);

    });

}

let myEvent = new Event("boz", {title:"My event"});
let myEvent2 = new Event("boz2", {title:"My event 2"});

document.dispatchEvent(myEvent);

window.addEventListener("load", (event) => {
    init();
});


"use strict"
var randomLevelOrder
var boost
var filledMouth
var stickyGround
var extendedFlutter
var deathStarCounter
var hardMode
var drunkMode
var noTongue
var noFlutter
var bouncyCastle
var randomCursor
var reverseControl
var turbo
var powerfulYoshi
var poisonCoins
var extraLevels
var bonusLevels

let modes = [
    boost, filledMouth, stickyGround,
    extendedFlutter, deathStarCounter, hardMode,
    drunkMode, noTongue, noFlutter, bouncyCastle,
    randomCursor, reverseControl, turbo,
    powerfulYoshi, poisonCoins
    ];


let getSettings = function() {
    boost = document.getElementById("boost").checked;
    filledMouth = document.getElementById("filledMouth").checked;
    stickyGround = document.getElementById("stickyGround").checked;
    extendedFlutter = document.getElementById("extendedFlutter").checked;
    deathStarCounter = document.getElementById("deathStarCounter").checked;
    hardMode = document.getElementById("hardMode").checked;
    drunkMode = document.getElementById("drunkMode").checked;
    noTongue = document.getElementById("noTongue").checked;
    noFlutter = document.getElementById("noFlutter").checked;
    bouncyCastle = document.getElementById("bouncyCastle").checked;
    randomCursor = document.getElementById("randomCursor").checked;
    reverseControl = document.getElementById("reverseControl").checked;
    turbo = document.getElementById("turbo").checked;
    powerfulYoshi = document.getElementById("powerfulYoshi").checked;
    poisonCoins = document.getElementById("poisonCoins").checked;
    extraLevels = document.getElementById("extraLevels").checked;
    bonusLevels = document.getElementById("bonusLevels").checked;
    randomLevelOrder = document.getElementById("randomLevelOrder").checked;

    modes = [
    boost, filledMouth, stickyGround,
    extendedFlutter, deathStarCounter, hardMode,
    drunkMode, noTongue, noFlutter, bouncyCastle,
    randomCursor, reverseControl, turbo,
    powerfulYoshi, poisonCoins
    ];
}

let maxModesInputVal = parseInt(document.getElementById("maxEnabledModes").value);
let maxEnabledModes = maxModesInputVal !== NaN ? maxModesInputVal : 100;

let levelModeFilter = {};

let levelIndexes = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
                    0x0C, 0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
                    0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20, 0x21,
                    0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,
                    0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
                    0x3C, 0x3D, 0x3E, 0x3F, 0x40, 0x41, 0x42, 0x43, 0x44, 0x45
];

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

let generateLevelOrder = function() {
    getSettings()
    var customLevelOrder = []

    for (let index = 0; index < 6; index++) {
        var worldNumber = index*10
        var normalLevels = levelIndexes.slice(worldNumber, worldNumber + 8)
        var extraLevel = levelIndexes.slice(worldNumber + 8, worldNumber + 9)
        var bonusLevel = levelIndexes.slice(worldNumber + 9, worldNumber + 10)
        customLevelOrder = customLevelOrder.concat(normalLevels)

        if (extraLevels) {
            customLevelOrder = customLevelOrder.concat(extraLevel)
        }

        if (bonusLevels) {
            customLevelOrder = customLevelOrder.concat(bonusLevel)
        }
    }

    if (randomLevelOrder) {
        customLevelOrder = shuffle(customLevelOrder)
    }

    console.log(customLevelOrder)
    return customLevelOrder
}

let randomBinary = function() {
    return Math.floor(Math.random() * 2);
}

let randomInteger = function(max) {
    return Math.floor(Math.random() * (max + 1));
}

let generate = function() {
    return Math.floor(Math.random() * 2);
}

function generateSeed() {
    document.getElementById("randomSeed").value = randomInteger(1000000000);
    console.log("hello")
}


/* Two options
 * 1. Get FileSaver.js from here
 *     https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.min.js -->
 *     <script src="FileSaver.min.js" />
 *
 * Or
 *
 * 2. If you want to support only modern browsers like Chrome, Edge, Firefox, etc., 
 *    then a simple implementation of saveAs function can be:
 */
function saveAs(blob, fileName) {
    var url = window.URL.createObjectURL(blob);

    var anchorElem = document.createElement("a");
    anchorElem.style = "display: none";
    anchorElem.href = url;
    anchorElem.download = fileName;

    document.body.appendChild(anchorElem);
    anchorElem.click();

    document.body.removeChild(anchorElem);

    // On Edge, revokeObjectURL should be called only after
    // a.click() has completed, atleast on EdgeHTML 15.15048
    setTimeout(function () {
        window.URL.revokeObjectURL(url);
    }, 1000);
}

(function () {
    // convert base64 string to byte array
    var byteCharacters = atob("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");
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);

    // now that we have the byte array, construct the blob from it
    var blob1 = new Blob([byteArray], { type: "application/octet-stream" });

    var fileName1 = "cool.gif";
    // saveAs(blob1, fileName1);

    // saving text file
    var blob2 = new Blob(["cool"], { type: "text/plain" });
    var fileName2 = "cool.txt";
    // saveAs(blob2, fileName2);
})();


var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://arnethegreat.github.io/yoshis-funland-randomizer/build.sfc', true);
xhr.responseType = 'blob';
var patched_rom_blob

xhr.onload = function (e) {
    if (this.status == 200) {
        // get binary data as a response
        patched_rom_blob = this.response;
        // console.log(patched_rom_blob)
    }
}


xhr.send();

console.log("Hello Kiwi")

console.log(patched_rom_blob)
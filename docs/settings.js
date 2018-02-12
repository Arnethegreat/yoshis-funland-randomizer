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

var normalLevels;
var fortressLevels;
var castleLevels;
var autoscrollers;

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

    normalLevels = []
    fortressLevels = []
    castleLevels = []
    autoscrollers = []
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

var LEVEL_SETTINGS = 0x118026;
var LEVEL_OFFSETS = [
//   1   2   3   4   5   6   7   8  //  E   B
     1,  2,  3,  4,  5,  6,  7,  8, //  9, 10, // World 1
    13, 14, 15, 16, 17, 18, 19, 20, // 21, 22, // World 2
    25, 26, 27, 28, 29, 30, 31, 32, // 33, 34, // World 3
    37, 38, 39, 40, 41, 42, 43, 44, // 45, 46, // World 4
    49, 50, 51, 52, 53, 54, 55, 56, // 57, 58, // World 5
    61, 62, 63, 64, 65, 66, 67, 68, // 69, 70  // World 6
];

function generateRom() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'build.sfc', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        if (this.status == 200) {
            var buffer = xhr.response;
            var rom = new Uint8Array(buffer);
            var levelOrder = generateLevelOrder();

            levelOrder.forEach(function(level, i) {
                rom[LEVEL_SETTINGS + LEVEL_OFFSETS[i]] = level;
            });

            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'yoshfun.sfc');
        }
    }

    xhr.send();
}

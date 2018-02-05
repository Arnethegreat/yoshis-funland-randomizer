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

console.log("Hello Kiwi")

// var xhr = new XMLHttpRequest();
// xhr.open('GET', "https://i.imgur.com/TUzS1fw.jpg", true);
// xhr.responseType = 'arraybuffer';

// xhr.onload = function (e) {
//     var uInt8Array = new Uint8Array(this.response); // this.response == uInt8Array.buffer
//   // var byte3 = uInt8Array[4]; // byte at offset 4
  
// };

// xhr.send();
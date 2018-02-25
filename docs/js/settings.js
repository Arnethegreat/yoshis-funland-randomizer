"use strict"



function getEnabledModes(options) {
    var enabledModes = [];

    Object.keys(options.modes).forEach(function(modeName) {
        var mode = options.modes[modeName];

        if (mode.enabled) {
            enabledModes.push(options.modes[modeName]);
        }
    });

    return enabledModes;
}

function randomizeLevelOrder(rom, options) {
    // Set Random Seed
    var seed = document.getElementById("randomSeed").value;
    Math.seedrandom(seed);

    var levelIndexes = {
        bowser: 0x43,
        castles: [ 0x07, 0x13, 0x1F, 0x2B, 0x37 ], // not including King Bowser's Castle because it's a special case
        forts: [ 0x03, 0x0F, 0x1B, 0x27, 0x33, 0x3F ],
        normals: [
            0x00, 0x01, 0x02, 0x04, 0x05, 0x06,
            0x0C, 0x0D, 0x0E, 0x10, 0x11, 0x12,
            0x18, 0x19, 0x1A, 0x1C, 0x1D, 0x1E,
            0x24, 0x25, 0x26, 0x28, 0x29, 0x2A,
            0x30, 0x31, 0x32, 0x34, 0x35, 0x36,
            0x3C, 0x3D, 0x3E, 0x40, 0x41, 0x42
        ],
        extras: [ 0x08, 0x14, 0x20, 0x2C, 0x38, 0x44 ],
        bonuses: [ 0x09, 0x15, 0x21, 0x2D, 0x39, 0x45 ]
    };


    var customLevelOrder = [];

    if (!options.keepCastleOrder) {
        levelIndexes.normals = levelIndexes.normals.concat(levelIndexes.forts);
        levelIndexes.normals = levelIndexes.normals.concat(levelIndexes.castles);
    }
    if (options.includeExtras) {
        levelIndexes.normals = levelIndexes.normals.concat(levelIndexes.extras);
    }

    levelIndexes.castles = shuffle(levelIndexes.castles);
    levelIndexes.forts = shuffle(levelIndexes.forts);
    levelIndexes.normals = shuffle(levelIndexes.normals);
    levelIndexes.extras = shuffle(levelIndexes.extras);

    for (var world = 1; world <= 6; world++) {
        customLevelOrder.push(levelIndexes.normals.shift()); // x-1
        customLevelOrder.push(levelIndexes.normals.shift()); // x-2
        customLevelOrder.push(levelIndexes.normals.shift()); // x-3

        if (options.keepCastleOrder) {
            customLevelOrder.push(levelIndexes.forts.shift()); // x-4, specifically use a fort
        }
        else {
            customLevelOrder.push(levelIndexes.normals.shift())
        }

        customLevelOrder.push(levelIndexes.normals.shift()); // x-5
        customLevelOrder.push(levelIndexes.normals.shift()); // x-6
        customLevelOrder.push(levelIndexes.normals.shift()); // x-7

        if (world == 6) {
            customLevelOrder.push(levelIndexes.bowser); // 6-8, always put 6-8 at the end
        }
        else if (options.keepCastleOrder) {
            customLevelOrder.push(levelIndexes.castles.shift()); // x-8, specifically use a castle
        }
        else {
            customLevelOrder.push(levelIndexes.normals.shift());
        }

        if (!options.includeExtras) {
            customLevelOrder.push(levelIndexes.extras.shift()); // x-E
        }
        else {
            customLevelOrder.push(levelIndexes.normals.shift());
        }
        customLevelOrder.push(levelIndexes.bonuses.shift()); // x-B
    }

    customLevelOrder.forEach(function(level, i) {
        rom[WORLD_MAPS + LEVEL_OFFSETS[i]] = level;
    });
    console.log(customLevelOrder)
}

let randomBinary = function() {
    return Math.floor(Math.random() * 2);
}

let randomInteger = function(max) {
    return Math.floor(Math.random() * (max + 1));
}

function generateSeed() {
    var seed = Math.seedrandom();
    seed = randomInteger(100000000)
    document.getElementById("randomSeed").value = seed;
}


function getOptions() {
    return {
        randomizeLevelOrder: $('input[name=randomizeLevelOrder]').is(':checked'),
        includeExtras: $('input[name=includeExtras]').is(':checked'),
        keepCastleOrder: $('input[name=keepCastleOrder]').is(':checked'),

        modes: {
            scoreRequirementMinimum: {
                code: 0x00,

                enabled: ($('input[name=scoreRequirementType]:checked').val() == 'minimum'),
                parameters: littleEndianToBytes(parseInt($('input[name=scoreRequirementScore]').val()), 1)
            },
            drunkMode: {
                code: 0x02,

                enabled: $('input[name=drunkMode]').is(':checked')
            },
            hardMode: {
                code: 0x04,

                enabled: $('input[name=hardMode]').is(':checked')
            },
            deathStarCounter: {
                code: 0x06,

                enabled: $('input[name=deathStarCounter]').is(':checked')
            },
            extendedFlutters: {
                code: 0x08,

                enabled: $('input[name=extendedFlutters]').is(':checked')
            },
            stickyGround: {
                code: 0x0A,

                enabled: $('input[name=stickyGround]').is(':checked')
            },
            filledMouth: {
                code: 0x0C,

                enabled: ($('select[name=filledMouth]').val() != ''),
                parameters: littleEndianToBytes(MOUTH_MODIFIERS[$('select[name=filledMouth]').val()], 1)
            },
            speedBoost: {
                code: 0x0E,

                enabled: $('input[name=speedBoost]').is(':checked'),
                parameters: [].concat(littleEndianToBytes(BOOST_MODIFIERS[$('select[name=speedBoostAcceleration]').val()], 2)).concat(littleEndianToBytes(BOOST_MODIFIERS[$('select[name=speedBoostMaximumSpeed]').val()], 2))
            },
            scoreRequirementMaximum: {
                code: 0x10,

                enabled: ($('input[name=scoreRequirementType]:checked').val() == 'maximum'),
                parameters: littleEndianToBytes(parseInt($('input[name=scoreRequirementScore]').val()), 1)
            },
            scoreRequirementExact: {
                code: 0x12,

                enabled: ($('input[name=scoreRequirementType]:checked').val() == 'exact'),
                parameters: littleEndianToBytes(parseInt($('input[name=scoreRequirementScore]').val()), 1)
            },
            reverseControls: {
                code: 0x14,

                enabled: $('input[name=reverseControls]').is(':checked')
            },
            randomEggCursor: {
                code: 0x16,

                enabled: $('input[name=randomEggCursor]').is(':checked')
            },
            bouncyCastle: {
                code: 0x18,

                enabled: $('input[name=bouncyCastle]').is(':checked')
            },
            airModifier: {
                code: 0x1A,

                enabled: ($('select[name=airModifier]').val() != ''),
                parameters: [].concat(littleEndianToBytes(DMG_TICKS_FRAMES, 2)).concat(littleEndianToBytes(HEALTH_MODIFIERS[$('select[name=airModifier]').val()], 2))
            },
            noFlutters: {
                code: 0x1C,

                enabled: $('input[name=noFlutters]').is(':checked')
            },
            nothingTongueable: {
                code: 0x1E,

                enabled: $('input[name=nothingTongueable]').is(':checked')
            },
            floorModifier: {
                code: 0x20,

                enabled: ($('select[name=floorModifier]').val() != ''),
                parameters: [].concat(littleEndianToBytes(DMG_TICKS_FRAMES, 2)).concat(littleEndianToBytes(HEALTH_MODIFIERS[$('select[name=floorModifier]').val()], 2))
            },
            coinModifier: {
                code: 0x22,

                enabled: ($('select[name=coinModifier]').val() != ''),
                parameters: littleEndianToBytes(HEALTH_MODIFIERS[$('select[name=coinModifier]').val()], 2)
            },
            flowerModifier: {
                code: 0x24,

                enabled: ($('select[name=flowerModifier]').val() != ''),
                parameters: littleEndianToBytes(HEALTH_MODIFIERS[$('select[name=flowerModifier]').val()], 2)
            }
        }
    };
}


function generateRom() {
    var options = getOptions();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'build.sfc', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        if (this.status == 200) {
            var buffer = xhr.response;
            var rom = new Uint8Array(buffer);

            if (options.randomizeLevelOrder) {
                randomizeLevelOrder(rom, options);
            }

            generateLevelSettings(rom, options);

            // this is the "everything is unlocked in file 3" debug flag
            rom[0xB9897] = 0xEAEAEA;

            fixChecksum(rom);

            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'yoshfun.sfc');
        }
    }

    xhr.send();
}

function generateLevelSettings(rom, options) {

    var levelSettings = [];
    var globalModes = getEnabledModes(options);

    LEVEL_OFFSETS.forEach(function(level, i) {
        globalModes.forEach(function(mode, i) {
            levelSettings.push(mode.code & 0xFF);

            if (typeof mode.parameters !== 'undefined' && mode.parameters) {
                levelSettings = levelSettings.concat(mode.parameters);
            }
        });

        levelSettings = levelSettings.concat(LEVEL_SETTINGS_ENDMARKER);

        // a bit of a hack but we need to account for the score and controller tiles at the end of the world maps
        if ((i + 1) % 10 == 0) {
            levelSettings = levelSettings.concat(LEVEL_SETTINGS_ENDMARKER);
            levelSettings = levelSettings.concat(LEVEL_SETTINGS_ENDMARKER);
        }
    });
    rom.set(levelSettings, LEVEL_SETTINGS);
}

function checkScoreRequirementType() {
    var scoreRequirementType = $('input[name=scoreRequirementType]:checked').val();

    if (scoreRequirementType == 'none') {
        $('input[name=scoreRequirementScore]').prop('disabled', true);
    }
    else {
        $('input[name=scoreRequirementScore]').prop('disabled', false);
    }
}

function checkSpeedBoost() {
    var speedBoostEnabled = $('input[name=speedBoost]').is(':checked');

    if (speedBoostEnabled) {
        $('select[name=speedBoostAcceleration]').prop('disabled', false);
        $('select[name=speedBoostMaximumSpeed]').prop('disabled', false);
    }
    else {
        $('select[name=speedBoostAcceleration]').prop('disabled', true);
        $('select[name=speedBoostMaximumSpeed]').prop('disabled', true);
    }
}

$(document).ready(function() {
    $('input[name=scoreRequirementType]').click(checkScoreRequirementType);
    $('input[name=speedBoost]').click(checkSpeedBoost);

    checkScoreRequirementType();
    checkSpeedBoost();
});

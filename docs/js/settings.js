"use strict";

// The prefix for the global settings panel (rendered by modes-ui.js on DOMContentLoaded)
var GLOBAL_PREFIX = 'global';

// ---------------------------------------------------------------------------
// Initialise the global panel controls
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    var globalControls = document.getElementById('globalModeControls');
    if (globalControls) {
        renderModeControls(GLOBAL_PREFIX, globalControls);
    }
    checkScoreRequirementType(); // legacy compat (no-op now, kept for safety)
});

// ---------------------------------------------------------------------------
// Legacy stubs — kept so any existing external calls don't break
// ---------------------------------------------------------------------------

function checkScoreRequirementType() {}
function checkSpeedBoost() {}

// ---------------------------------------------------------------------------
// Seed helpers
// ---------------------------------------------------------------------------

function generateSeed() {
    Math.seedrandom();
    var seed = Math.floor(Math.random() * 100000001);
    document.getElementById("randomSeed").value = seed;
}

// ---------------------------------------------------------------------------
// Read global options
// ---------------------------------------------------------------------------

function getOptions() {
    return {
        randomizeLevelOrder: document.getElementById('randomizeLevelOrder')
            ? document.getElementById('randomizeLevelOrder').checked : false,
        includeExtras: document.getElementById('includeExtras')
            ? document.getElementById('includeExtras').checked : false,
        keepCastleOrder: document.getElementById('keepCastleOrder')
            ? document.getElementById('keepCastleOrder').checked : true,
        modes: getModeOptions(GLOBAL_PREFIX)
    };
}

// ---------------------------------------------------------------------------
// Level order randomization (unchanged logic)
// ---------------------------------------------------------------------------

function randomizeLevelOrder(rom, options) {
    var seed = document.getElementById("randomSeed").value;
    Math.seedrandom(seed);

    var levelIndexes = {
        bowser:  0x43,
        castles: [ 0x07, 0x13, 0x1F, 0x2B, 0x37 ],
        forts:   [ 0x03, 0x0F, 0x1B, 0x27, 0x33, 0x3F ],
        normals: [
            0x00, 0x01, 0x02, 0x04, 0x05, 0x06,
            0x0C, 0x0D, 0x0E, 0x10, 0x11, 0x12,
            0x18, 0x19, 0x1A, 0x1C, 0x1D, 0x1E,
            0x24, 0x25, 0x26, 0x28, 0x29, 0x2A,
            0x30, 0x31, 0x32, 0x34, 0x35, 0x36,
            0x3C, 0x3D, 0x3E, 0x40, 0x41, 0x42
        ],
        extras:  [ 0x08, 0x14, 0x20, 0x2C, 0x38, 0x44 ],
        bonuses: [ 0x09, 0x15, 0x21, 0x2D, 0x39, 0x45 ]
    };

    if (!options.keepCastleOrder) {
        levelIndexes.normals = levelIndexes.normals.concat(levelIndexes.forts);
        levelIndexes.normals = levelIndexes.normals.concat(levelIndexes.castles);
    }
    if (options.includeExtras) {
        levelIndexes.normals = levelIndexes.normals.concat(levelIndexes.extras);
    }

    levelIndexes.castles = shuffle(levelIndexes.castles);
    levelIndexes.forts   = shuffle(levelIndexes.forts);
    levelIndexes.normals = shuffle(levelIndexes.normals);
    levelIndexes.extras  = shuffle(levelIndexes.extras);

    var customLevelOrder = [];

    for (var world = 1; world <= 6; world++) {
        customLevelOrder.push(levelIndexes.normals.shift()); // x-1
        customLevelOrder.push(levelIndexes.normals.shift()); // x-2
        customLevelOrder.push(levelIndexes.normals.shift()); // x-3

        if (options.keepCastleOrder) {
            customLevelOrder.push(levelIndexes.forts.shift()); // x-4 fort
        } else {
            customLevelOrder.push(levelIndexes.normals.shift());
        }

        customLevelOrder.push(levelIndexes.normals.shift()); // x-5
        customLevelOrder.push(levelIndexes.normals.shift()); // x-6
        customLevelOrder.push(levelIndexes.normals.shift()); // x-7

        if (world === 6) {
            customLevelOrder.push(levelIndexes.bowser);        // 6-8 always
        } else if (options.keepCastleOrder) {
            customLevelOrder.push(levelIndexes.castles.shift()); // x-8 castle
        } else {
            customLevelOrder.push(levelIndexes.normals.shift());
        }

        if (!options.includeExtras) {
            customLevelOrder.push(levelIndexes.extras.shift()); // x-E
        } else {
            customLevelOrder.push(levelIndexes.normals.shift());
        }
        customLevelOrder.push(levelIndexes.bonuses.shift()); // x-B
    }

    // Apply per-level overrides: redirect map slots to their chosen level IDs
    if (typeof levelOverrides !== 'undefined') {
        levelOverrides.forEach(function(ov) {
            // Find which position in customLevelOrder corresponds to this mapSlot
            var pos = LEVEL_OFFSETS.indexOf(
                LEVEL_OFFSETS[_mapSlotToOrderIndex(ov.mapSlot)]
            );
            var orderIndex = _mapSlotToOrderIndex(ov.mapSlot);
            if (orderIndex >= 0 && orderIndex < customLevelOrder.length) {
                customLevelOrder[orderIndex] = ov.levelId;
            }
        });
    }

    customLevelOrder.forEach(function(level, i) {
        rom[WORLD_MAPS + LEVEL_OFFSETS[i]] = level;
    });
}

/**
 * Convert a playable map slot index (0x00–0x47, skipping score/controller tiles)
 * to an index within the 60-element LEVEL_OFFSETS array.
 * The LEVEL_OFFSETS array is already ordered by world-map position.
 */
function _mapSlotToOrderIndex(mapSlot) {
    // Map slot hex keys in levelNames are the original game level IDs.
    // LEVEL_OFFSETS has 60 entries: 10 per world (levels 1–8, E, B), worlds 1–6.
    // We need the position of mapSlot in the ordered playable-slot list.
    var ordered = _orderedPlayableSlots();
    return ordered.indexOf(mapSlot);
}

function _orderedPlayableSlots() {
    // Returns the 60 playable slot indices in world-map order.
    // Each world: [x-1, x-2, x-3, x-4, x-5, x-6, x-7, x-8, x-E, x-B]
    // This matches LEVEL_OFFSETS ordering exactly.
    var result = [];
    var worldBases = [0x00, 0x0C, 0x18, 0x24, 0x30, 0x3C];
    worldBases.forEach(function(base) {
        // x-1 through x-8: offsets 0..7
        for (var i = 0; i < 8; i++) result.push(base + i);
        // x-E: offset 8
        result.push(base + 8);
        // x-B: offset 9
        result.push(base + 9);
    });
    return result;
}

// ---------------------------------------------------------------------------
// Level settings generation — merges global modes with per-level overrides
// ---------------------------------------------------------------------------

function generateLevelSettings(rom, options) {
    var levelSettings = [];
    var globalModes   = _getEnabledModesList(options.modes);

    // Build a lookup: mapSlot -> override entry
    var overrideMap = {};
    if (typeof levelOverrides !== 'undefined') {
        levelOverrides.forEach(function(ov) {
            overrideMap[ov.mapSlot] = ov;
        });
    }

    var orderedSlots = _orderedPlayableSlots();

    LEVEL_OFFSETS.forEach(function(levelOffset, i) {
        var mapSlot = orderedSlots[i];
        var modesForSlot;

        if (mapSlot !== undefined && overrideMap[mapSlot]) {
            // Use per-level override modes instead of global
            modesForSlot = _getEnabledModesList(overrideMap[mapSlot].modes);
        } else {
            modesForSlot = globalModes;
        }

        modesForSlot.forEach(function(mode) {
            levelSettings.push(mode.code & 0xFF);
            if (typeof mode.parameters !== 'undefined' && mode.parameters) {
                levelSettings = levelSettings.concat(mode.parameters);
            }
        });

        levelSettings = levelSettings.concat(LEVEL_SETTINGS_ENDMARKER);

        // Extra endmarkers for score and controller tiles after each world (every 10th entry)
        if ((i + 1) % 10 === 0) {
            levelSettings = levelSettings.concat(LEVEL_SETTINGS_ENDMARKER);
            levelSettings = levelSettings.concat(LEVEL_SETTINGS_ENDMARKER);
        }
    });

    rom.set(levelSettings, LEVEL_SETTINGS);
}

function _getEnabledModesList(modes) {
    return Object.keys(modes)
        .filter(function(k) { return modes[k].enabled; })
        .map(function(k) { return modes[k]; });
}

// ---------------------------------------------------------------------------
// ROM generation entry point
// ---------------------------------------------------------------------------

function generateRom() {
    var options = getOptions();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'build.sfc', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        if (this.status !== 200) return;

        var buffer = xhr.response;
        var rom    = new Uint8Array(buffer);

        if (options.randomizeLevelOrder) {
            randomizeLevelOrder(rom, options);
        } else if (typeof levelOverrides !== 'undefined' && levelOverrides.length > 0) {
            // Even without full randomization, apply per-level redirects
            levelOverrides.forEach(function(ov) {
                var orderIndex = _mapSlotToOrderIndex(ov.mapSlot);
                if (orderIndex >= 0) {
                    rom[WORLD_MAPS + LEVEL_OFFSETS[orderIndex]] = ov.levelId;
                }
            });
        }

        generateLevelSettings(rom, options);

        // Debug flag: unlock everything in file 3
        rom[0xB9897] = 0xEA;
        rom[0xB9898] = 0xEA;
        rom[0xB9899] = 0xEA;

        fixChecksum(rom);

        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'yoshfun.sfc');
    };

    xhr.send();
}

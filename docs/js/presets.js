"use strict";

/**
 * presets.js
 * ---------------------------------------------------------------------------
 * Developer-defined preset configurations shown in the "Load Preset" dropdown.
 *
 * Each entry shape:
 * {
 *   id          : string   -- unique key, used internally (never shown)
 *   name        : string   -- shown in dropdown
 *   description : string   -- shown below dropdown on hover / selection
 *   settings    : object   -- same shape as collectSettings() output:
 *     {
 *       seed               : number   (optional; omit to leave seed unchanged)
 *       randomizeLevelOrder: boolean
 *       keepCastleOrder    : boolean
 *       includeExtras      : boolean
 *       globalModes        : raw modes object (see collectRawForPrefix shape)
 *       levelOverrides     : array of override entries (same shape as levelOverrides[])
 *         each: { mapSlot, levelId, _raw: raw modes object }
 *     }
 * }
 *
 * To add a preset: append an object to PRESETS below — nothing else needs changing.
 * To remove a preset: delete its entry from PRESETS.
 */

var PRESETS = [

    // ── Blank / clear ────────────────────────────────────────────────────────
    {
        id: 'default',
        name: 'Default (No Modes)',
        description: 'Randomized level order with no gameplay modes enabled. A clean starting point.',
        settings: {
            randomizeLevelOrder: true,
            keepCastleOrder: true,
            includeExtras: false,
            globalModes: {}
        }
    },

    // ── Casual fun ───────────────────────────────────────────────────────────
    {
        id: 'bouncy_fun',
        name: 'Bouncy Fun',
        description: 'Everything is bouncy. Yoshi bounces off every floor. Great for chaotic runs.',
        settings: {
            randomizeLevelOrder: true,
            keepCastleOrder: true,
            includeExtras: false,
            globalModes: {
                bouncyCastle: true,
                extendedFlutters: true
            }
        }
    },

    {
        id: 'speed_run',
        name: 'Speed Run',
        description: 'Speed boost enabled at fast acceleration, extended flutters for maximum movement. Go fast.',
        settings: {
            randomizeLevelOrder: true,
            keepCastleOrder: true,
            includeExtras: false,
            globalModes: {
                speedBoost: true,
                speedBoostAcceleration: 'accelerateFast',
                speedBoostMaximumSpeed: 'maximumSpeedVeryFast',
                extendedFlutters: true
            }
        }
    },

    // ── Challenge ────────────────────────────────────────────────────────────
    {
        id: 'hardcore',
        name: 'Hardcore',
        description: 'One-hit deaths, instant death at 0 stars, and the floor damages you. Not for the faint-hearted.',
        settings: {
            randomizeLevelOrder: true,
            keepCastleOrder: false,
            includeExtras: false,
            globalModes: {
                hardMode: true,
                deathStarCounter: true,
                floorModifier: 'damageMedium'
            }
        }
    },

    {
        id: 'score_challenge',
        name: 'Score Challenge',
        description: 'Must reach exactly 100 points to clear each level. Coins hurt and flowers heal — every collectible matters.',
        settings: {
            randomizeLevelOrder: true,
            keepCastleOrder: true,
            includeExtras: false,
            globalModes: {
                scoreRequirementType: 'exact',
                scoreRequirementScore: 100,
                deathStarCounter: true,
                coinModifier: 'damageTwo',
                flowerModifier: 'healFive'
            }
        }
    },

    {
        id: 'poison_world',
        name: 'Poison World',
        description: 'The air damages you constantly. Land on the ground to heal, but only slowly. Death at 0 stars.',
        settings: {
            randomizeLevelOrder: true,
            keepCastleOrder: true,
            includeExtras: false,
            globalModes: {
                airModifier: 'damageMedium',
                floorModifier: 'healSlow',
                deathStarCounter: true
            }
        }
    },

    // ── Chaos ────────────────────────────────────────────────────────────────
    {
        id: 'full_chaos',
        name: 'Full Chaos',
        description: 'Drunk mode, reversed controls & random egg cursor. Have Fun :>.',
        settings: {
            randomizeLevelOrder: true,
            keepCastleOrder: false,
            includeExtras: true,
            globalModes: {
                drunkMode: true,
                reverseControls: true,
                randomEggCursor: true,
            }
        }
    }

];

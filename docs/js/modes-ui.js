"use strict";

/**
 * modes-ui.js
 * Renders the full set of mode controls into a given container element.
 * Each control is namespaced by `prefix` so multiple independent sets can
 * coexist on the same page (global settings vs. per-level overrides).
 *
 * Also provides getModeOptions(prefix) to read back the current values as
 * a modes object compatible with getOptions() / generateLevelSettings().
 */

// ---------------------------------------------------------------------------
// Tooltip text — edit these strings to update descriptions
// ---------------------------------------------------------------------------

var MODE_TIPS = {
    drunkMode:              'Yoshi is permanently dizzy (as if touching a Fuzzy). Impaired movement for the whole level.',
    extendedFlutters:       'Yoshi can always perform an extended flutter jump, as if he just bounced off an enemy. No limit on flutter height.',
    noFlutters:             'Flutters are completely disabled. Yoshi cannot gain extra height by flapping his legs.',
    reverseControls:        'Left and Right inputs are swapped for the entire level, just like the reverse-controls enemy in 4-E.',
    walljumps:              'Allows Yoshi to jump off walls. Work-in-progress — left-side kick not fully implemented yet.',
    speedBoost:             'Press the X button to get a burst of horizontal speed. Acceleration and max speed are configurable below. A lil buggy for now :3',
    speedBoostAcceleration: 'How quickly the speed boost builds up each frame while X is held.',
    speedBoostMaximumSpeed: 'The highest speed the boost can reach. "Too Fast for Camera" may cause the camera to lag behind.',
    floorModifier:          'What happens to Yoshi\'s star count while touching the ground. Damage turns the floor into lava; healing restores stars.',
    airModifier:            'What happens to Yoshi\'s star count while airborne (not touching ground or a platform). Pairs well with Instant Death at 0 Stars.',
    coinModifier:           'Collecting a coin gives or removes this many stars. Negative values act as poison coins.',
    flowerModifier:         'Collecting a flower gives or removes this many stars. Negative values act as poison flowers.',
    deathStarCounter:       'If the star counter reaches 0, Yoshi dies instantly. Designed to be used with Floor, Air, Coin, or Flower modifiers. Use with',
    hardMode:               'Any hit immediately drops the star counter to 0 (one-hit kill unless paired with a regen source or instantly recollect Mario).',
    bouncyCastle:           'Yoshi bounces off every surface he lands on, like a rubber ball. Ground pounds launch him extra high.',
    stickyGround:           'Ground movement is extremely slow; Yoshi is stuck to the floor. Air speed is unaffected.',
    scoreRequirementType:   'Set a condition on the level score (stars+flowers+red coins, 0–100) that must be met to pass through the goal ring.',
    scoreRequirementScore:  'The score threshold value (0–100). Stars are worth 1 pt each (up to 30), flowers 10 pts each, red coins 1 pt each.',
    nothingTongueable:      'Yoshi\'s tongue cannot grab any enemy or sprite. Eggs can still be thrown but nothing new can be collected.',
    randomEggCursor:        'The egg-throw cursor angle is randomised every frame, making it impossible to aim precisely.',
    filledMouth:            'Yoshi\'s mouth is permanently filled with the chosen ammo type and refills instantly after firing.'
};

/** Build a tooltip badge element string for the given key, if a tip exists. */
function _tip(key) {
    var text = MODE_TIPS[key];
    if (!text) return '';
    // Escape single quotes for the data attribute
    var safe = text.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    return '<span class="tip" data-tip="' + safe + '">?</span>';
}

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------

function _checkbox(prefix, name, label, checked) {
    var id = prefix + '_' + name;
    return '<div class="col-auto form-check">'
        + '<input class="form-check-input" type="checkbox" id="' + id + '" name="' + id + '"' + (checked ? ' checked="checked"' : '') + ' />'
        + '<label class="form-check-label" for="' + id + '">' + label + _tip(name) + '</label>'
        + '</div>';
}

function _radio(prefix, group, value, label, checked) {
    var id = prefix + '_' + group + '_' + value;
    var name = prefix + '_' + group;
    // Tip key is the group name (e.g. 'scoreRequirementType') for the first radio only
    var tipHtml = (value === 'none') ? _tip(group) : '';
    return '<div class="col-auto form-check">'
        + '<input class="form-check-input" type="radio" id="' + id + '" name="' + name + '" value="' + value + '"' + (checked ? ' checked="checked"' : '') + ' />'
        + '<label class="form-check-label" for="' + id + '">' + label + tipHtml + '</label>'
        + '</div>';
}

function _select(prefix, name, label, options, selectedValue) {
    var id = prefix + '_' + name;
    var html = '<div class="col-auto form-group">';
    if (label) html += '<label class="col-form-label" for="' + id + '">' + label + _tip(name) + '</label>';
    html += '<select class="form-control form-control-sm" id="' + id + '" name="' + id + '">';
    options.forEach(function(opt) {
        html += '<option value="' + opt.value + '"' + (opt.value === selectedValue ? ' selected="selected"' : '') + '>' + opt.label + '</option>';
    });
    html += '</select></div>';
    return html;
}

function _number(prefix, name, label, value, min, max) {
    var id = prefix + '_' + name;
    return '<div class="col-6 col-md-4 form-group">'
        + (label ? '<label class="col-form-label" for="' + id + '">' + label + _tip(name) + '</label>' : '')
        + '<input class="form-control form-control-sm" type="number" id="' + id + '" name="' + id + '" value="' + value + '" min="' + min + '" max="' + max + '" />'
        + '</div>';
}

// ---------------------------------------------------------------------------
// Render a full mode controls panel into `container` (DOM element or selector)
// ---------------------------------------------------------------------------

function renderModeControls(prefix, container) {
    var el = (typeof container === 'string') ? document.querySelector(container) : container;

    el.innerHTML = [

        // ── Movement ────────────────────────────────────────────────────────
        '<h6 class="mode-section-title">Movement</h6>',
        _checkbox(prefix, 'drunkMode',       'Drunk Mode'),
        _checkbox(prefix, 'extendedFlutters','All Flutters Extended'),
        _checkbox(prefix, 'noFlutters',      'No Flutters'),
        _checkbox(prefix, 'reverseControls', 'Reverse Controls'),
        _checkbox(prefix, 'walljumps',       'Wall Jumps (broken dont use)'),

        // Speed boost sub-group
        '<div class="mode-subgroup mt-1">',
        _checkbox(prefix, 'speedBoost', 'Speed Boost (X Button)'),
        '<div class="mode-subgroup-params pl-3 mt-1" id="' + prefix + '_speedBoostParams">',
        _select(prefix, 'speedBoostAcceleration', 'Acceleration', [
            { value: 'accelerateSlow',     label: 'Slow'      },
            { value: 'accelerateMedium',   label: 'Medium'    },
            { value: 'accelerateFast',     label: 'Fast'      },
            { value: 'accelerateVeryFast', label: 'Very Fast' }
        ], 'accelerateMedium'),
        _select(prefix, 'speedBoostMaximumSpeed', 'Maximum Speed', [
            { value: 'maximumSpeedSlow',    label: 'Slow'               },
            { value: 'maximumSpeedMedium',  label: 'Medium'             },
            { value: 'maximumSpeedFast',    label: 'Fast'               },
            { value: 'maximumSpeedVeryFast',label: 'Very Fast'          },
            { value: 'maximumSpeedTooFast', label: 'Too Fast for Camera'}
        ], 'maximumSpeedMedium'),
        '</div></div>',

        // ── Health & Environment ─────────────────────────────────────────────
        '<h6 class="mode-section-title mt-2">Health &amp; Environment</h6>',
        _select(prefix, 'floorModifier', 'Floor', [
            { value: '',              label: '-- Off --'          },
            { value: 'healVeryFast',  label: 'Heals Very Quickly' },
            { value: 'healFast',      label: 'Heals Quickly'      },
            { value: 'healMedium',    label: 'Heals Moderately'   },
            { value: 'healSlow',      label: 'Heals Slowly'       },
            { value: 'damageSlow',    label: 'Damages Slowly'     },
            { value: 'damageMedium',  label: 'Damages Moderately' },
            { value: 'damageFast',    label: 'Damages Quickly'    },
            { value: 'damageVeryFast',label: 'Damages Very Quickly'}
        ], ''),
        _select(prefix, 'airModifier', 'Air', [
            { value: '',              label: '-- Off --'          },
            { value: 'healVeryFast',  label: 'Heals Very Quickly' },
            { value: 'healFast',      label: 'Heals Quickly'      },
            { value: 'healMedium',    label: 'Heals Moderately'   },
            { value: 'healSlow',      label: 'Heals Slowly'       },
            { value: 'damageSlow',    label: 'Damages Slowly'     },
            { value: 'damageMedium',  label: 'Damages Moderately' },
            { value: 'damageFast',    label: 'Damages Quickly'    },
            { value: 'damageVeryFast',label: 'Damages Very Quickly'}
        ], ''),
        _select(prefix, 'coinModifier', 'Coins', [
            { value: '',            label: '-- Off --'       },
            { value: 'healTen',     label: 'Heal 10 Stars'   },
            { value: 'healFive',    label: 'Heal 5 Stars'    },
            { value: 'healTwo',     label: 'Heal 2 Stars'    },
            { value: 'healOne',     label: 'Heal 1 Star'     },
            { value: 'damageOne',   label: 'Damage 1 Star'   },
            { value: 'damageTwo',   label: 'Damage 2 Stars'  },
            { value: 'damageFive',  label: 'Damage 5 Stars'  },
            { value: 'damageTen',   label: 'Damage 10 Stars' },
            { value: 'damageTwenty',label: 'Damage 20 Stars' },
            { value: 'damageAll',   label: 'Damage All Stars'}
        ], ''),
        _select(prefix, 'flowerModifier', 'Flowers', [
            { value: '',            label: '-- Off --'       },
            { value: 'healTen',     label: 'Heal 10 Stars'   },
            { value: 'healFive',    label: 'Heal 5 Stars'    },
            { value: 'healTwo',     label: 'Heal 2 Stars'    },
            { value: 'healOne',     label: 'Heal 1 Star'     },
            { value: 'damageOne',   label: 'Damage 1 Star'   },
            { value: 'damageTwo',   label: 'Damage 2 Stars'  },
            { value: 'damageFive',  label: 'Damage 5 Stars'  },
            { value: 'damageTen',   label: 'Damage 10 Stars' },
            { value: 'damageTwenty',label: 'Damage 20 Stars' },
            { value: 'damageAll',   label: 'Damage All Stars'}
        ], ''),
        _checkbox(prefix, 'deathStarCounter','Instant Death at 0 Stars'),
        _checkbox(prefix, 'hardMode',        'One-Hit Deaths'),
        _checkbox(prefix, 'bouncyCastle',    'Bouncy Castle'),
        _checkbox(prefix, 'stickyGround',    'Sticky Ground'),

        // ── Score Requirement ────────────────────────────────────────────────
        '<h6 class="mode-section-title mt-2">Score Requirement</h6>',
        _radio(prefix, 'scoreRequirementType', 'none',    'None',     true),
        _radio(prefix, 'scoreRequirementType', 'minimum', 'At Least', false),
        _radio(prefix, 'scoreRequirementType', 'exact',   'Exactly',  false),
        _radio(prefix, 'scoreRequirementType', 'maximum', 'At Most',  false),
        _number(prefix, 'scoreRequirementScore', '', 10, 0, 100),

        // ── Egg & Mouth ──────────────────────────────────────────────────────
        '<h6 class="mode-section-title mt-2">Egg &amp; Mouth</h6>',
        _checkbox(prefix, 'nothingTongueable','Nothing Is Tongueable'),
        _checkbox(prefix, 'randomEggCursor',  'Egg Cursor Randomized'),
        _select(prefix, 'filledMouth', 'Mouth Always Filled With', [
            { value: '',       label: '-- Off --'   },
            { value: 'bubbles',label: 'Bubbles'     },
            { value: 'seeds',  label: 'Melon Seeds' }
        ], '')

    ].join('\n');

    // Wire up conditional visibility of speed-boost sub-params
    _bindSpeedBoostToggle(prefix);
    // Wire up score input enable/disable
    _bindScoreToggle(prefix);
}

// ---------------------------------------------------------------------------
// Internal wiring helpers
// ---------------------------------------------------------------------------

function _bindSpeedBoostToggle(prefix) {
    var cb = document.getElementById(prefix + '_speedBoost');
    var params = document.getElementById(prefix + '_speedBoostParams');
    if (!cb || !params) return;
    function update() { params.style.display = cb.checked ? '' : 'none'; }
    cb.addEventListener('change', update);
    update();
}

function _bindScoreToggle(prefix) {
    var inputs = document.querySelectorAll('input[name="' + prefix + '_scoreRequirementType"]');
    var scoreInput = document.getElementById(prefix + '_scoreRequirementScore');
    if (!scoreInput) return;
    function update() {
        var val = document.querySelector('input[name="' + prefix + '_scoreRequirementType"]:checked');
        scoreInput.disabled = !val || val.value === 'none';
    }
    inputs.forEach(function(r) { r.addEventListener('change', update); });
    update();
}

// ---------------------------------------------------------------------------
// Apply a raw settings snapshot back onto a rendered panel
// (used by save/load system to restore global panel or a per-level builder)
// ---------------------------------------------------------------------------

/**
 * Writes a raw settings snapshot (as produced by collectRawForPrefix) back
 * into the DOM controls identified by `prefix`.
 *
 * raw shape:
 *   {
 *     drunkMode, hardMode, deathStarCounter, extendedFlutters, noFlutters,
 *     reverseControls, walljumps, speedBoost, bouncyCastle, stickyGround,
 *     nothingTongueable, randomEggCursor,         -- booleans
 *     floorModifier, airModifier, coinModifier, flowerModifier,
 *     filledMouth, speedBoostAcceleration, speedBoostMaximumSpeed,  -- strings
 *     scoreRequirementType,                        -- 'none'|'minimum'|'maximum'|'exact'
 *     scoreRequirementScore                        -- number
 *   }
 */
function applyRawModesToPrefix(raw, prefix) {
    if (!raw) return;

    function setCheck(name, val) {
        var el = document.getElementById(prefix + '_' + name);
        if (el) el.checked = !!val;
    }
    function setSelect(name, val) {
        var el = document.getElementById(prefix + '_' + name);
        if (el) el.value = val || '';
    }
    function setRadio(group, val) {
        var el = document.querySelector(
            'input[name="' + prefix + '_' + group + '"][value="' + (val || 'none') + '"]'
        );
        if (el) { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    function setNumber(name, val) {
        var el = document.getElementById(prefix + '_' + name);
        if (el) el.value = (val !== undefined && val !== null) ? val : '';
    }

    setCheck('drunkMode',        raw.drunkMode);
    setCheck('hardMode',         raw.hardMode);
    setCheck('deathStarCounter', raw.deathStarCounter);
    setCheck('extendedFlutters', raw.extendedFlutters);
    setCheck('noFlutters',       raw.noFlutters);
    setCheck('reverseControls',  raw.reverseControls);
    setCheck('walljumps',        raw.walljumps);
    setCheck('speedBoost',       raw.speedBoost);
    setCheck('bouncyCastle',     raw.bouncyCastle);
    setCheck('stickyGround',     raw.stickyGround);
    setCheck('nothingTongueable',raw.nothingTongueable);
    setCheck('randomEggCursor',  raw.randomEggCursor);

    setSelect('floorModifier',          raw.floorModifier          || '');
    setSelect('airModifier',            raw.airModifier            || '');
    setSelect('coinModifier',           raw.coinModifier           || '');
    setSelect('flowerModifier',         raw.flowerModifier         || '');
    setSelect('filledMouth',            raw.filledMouth            || '');
    setSelect('speedBoostAcceleration', raw.speedBoostAcceleration || 'accelerateMedium');
    setSelect('speedBoostMaximumSpeed', raw.speedBoostMaximumSpeed || 'maximumSpeedMedium');

    setRadio('scoreRequirementType', raw.scoreRequirementType || 'none');
    setNumber('scoreRequirementScore', raw.scoreRequirementScore !== undefined ? raw.scoreRequirementScore : 10);

    // Re-trigger dependent UI toggles
    var speedBoostEl = document.getElementById(prefix + '_speedBoost');
    if (speedBoostEl) speedBoostEl.dispatchEvent(new Event('change'));
}

/**
 * Read every raw control value from a rendered prefix panel.
 * Returns an object compatible with applyRawModesToPrefix().
 */
function collectRawForPrefix(prefix) {
    function getCheck(name) {
        var el = document.getElementById(prefix + '_' + name);
        return el ? el.checked : false;
    }
    function getSelect(name) {
        var el = document.getElementById(prefix + '_' + name);
        return el ? el.value : '';
    }
    function getRadio(group) {
        var el = document.querySelector('input[name="' + prefix + '_' + group + '"]:checked');
        return el ? el.value : 'none';
    }
    function getNumber(name) {
        var el = document.getElementById(prefix + '_' + name);
        return el ? parseInt(el.value) : 0;
    }

    return {
        drunkMode:              getCheck('drunkMode'),
        hardMode:               getCheck('hardMode'),
        deathStarCounter:       getCheck('deathStarCounter'),
        extendedFlutters:       getCheck('extendedFlutters'),
        noFlutters:             getCheck('noFlutters'),
        reverseControls:        getCheck('reverseControls'),
        walljumps:              getCheck('walljumps'),
        speedBoost:             getCheck('speedBoost'),
        bouncyCastle:           getCheck('bouncyCastle'),
        stickyGround:           getCheck('stickyGround'),
        nothingTongueable:      getCheck('nothingTongueable'),
        randomEggCursor:        getCheck('randomEggCursor'),
        floorModifier:          getSelect('floorModifier'),
        airModifier:            getSelect('airModifier'),
        coinModifier:           getSelect('coinModifier'),
        flowerModifier:         getSelect('flowerModifier'),
        filledMouth:            getSelect('filledMouth'),
        speedBoostAcceleration: getSelect('speedBoostAcceleration'),
        speedBoostMaximumSpeed: getSelect('speedBoostMaximumSpeed'),
        scoreRequirementType:   getRadio('scoreRequirementType'),
        scoreRequirementScore:  getNumber('scoreRequirementScore')
    };
}

// ---------------------------------------------------------------------------
// Read back current values from a rendered panel
// ---------------------------------------------------------------------------

function getModeOptions(prefix) {
    function checked(name) {
        var el = document.getElementById(prefix + '_' + name);
        return el ? el.checked : false;
    }
    function selectVal(name) {
        var el = document.getElementById(prefix + '_' + name);
        return el ? el.value : '';
    }
    function radioVal(group) {
        var el = document.querySelector('input[name="' + prefix + '_' + group + '"]:checked');
        return el ? el.value : 'none';
    }
    function numVal(name, def) {
        var el = document.getElementById(prefix + '_' + name);
        return el ? parseInt(el.value) : def;
    }

    var scoreType = radioVal('scoreRequirementType');
    var scoreValue = numVal('scoreRequirementScore', 10);
    var boostAccel = selectVal('speedBoostAcceleration');
    var boostMax   = selectVal('speedBoostMaximumSpeed');
    var floor      = selectVal('floorModifier');
    var air        = selectVal('airModifier');
    var coin       = selectVal('coinModifier');
    var flower     = selectVal('flowerModifier');
    var mouth      = selectVal('filledMouth');

    return {
        scoreRequirementMinimum: {
            code: 0x00,
            enabled: (scoreType === 'minimum'),
            parameters: littleEndianToBytes(scoreValue, 1)
        },
        drunkMode: {
            code: 0x02,
            enabled: checked('drunkMode')
        },
        hardMode: {
            code: 0x04,
            enabled: checked('hardMode')
        },
        deathStarCounter: {
            code: 0x06,
            enabled: checked('deathStarCounter')
        },
        extendedFlutters: {
            code: 0x08,
            enabled: checked('extendedFlutters')
        },
        stickyGround: {
            code: 0x0A,
            enabled: checked('stickyGround')
        },
        filledMouth: {
            code: 0x0C,
            enabled: (mouth !== ''),
            parameters: littleEndianToBytes(MOUTH_MODIFIERS[mouth] || 0, 1)
        },
        speedBoost: {
            code: 0x0E,
            enabled: checked('speedBoost'),
            parameters: [].concat(littleEndianToBytes(BOOST_MODIFIERS[boostAccel] || 0, 2))
                          .concat(littleEndianToBytes(BOOST_MODIFIERS[boostMax]   || 0, 2))
        },
        scoreRequirementMaximum: {
            code: 0x10,
            enabled: (scoreType === 'maximum'),
            parameters: littleEndianToBytes(scoreValue, 1)
        },
        scoreRequirementExact: {
            code: 0x12,
            enabled: (scoreType === 'exact'),
            parameters: littleEndianToBytes(scoreValue, 1)
        },
        reverseControls: {
            code: 0x14,
            enabled: checked('reverseControls')
        },
        randomEggCursor: {
            code: 0x16,
            enabled: checked('randomEggCursor')
        },
        bouncyCastle: {
            code: 0x18,
            enabled: checked('bouncyCastle')
        },
        airModifier: {
            code: 0x1A,
            enabled: (air !== ''),
            parameters: [].concat(littleEndianToBytes(DMG_TICKS_FRAMES, 2))
                          .concat(littleEndianToBytes(HEALTH_MOD_RATE[air] || 0, 2))
        },
        noFlutters: {
            code: 0x1C,
            enabled: checked('noFlutters')
        },
        nothingTongueable: {
            code: 0x1E,
            enabled: checked('nothingTongueable')
        },
        floorModifier: {
            code: 0x20,
            enabled: (floor !== ''),
            parameters: [].concat(littleEndianToBytes(DMG_TICKS_FRAMES, 2))
                          .concat(littleEndianToBytes(HEALTH_MOD_RATE[floor] || 0, 2))
        },
        coinModifier: {
            code: 0x22,
            enabled: (coin !== ''),
            parameters: littleEndianToBytes(HEALTH_MOD_AMOUNT[coin] || 0, 2)
        },
        flowerModifier: {
            code: 0x24,
            enabled: (flower !== ''),
            parameters: littleEndianToBytes(HEALTH_MOD_AMOUNT[flower] || 0, 2)
        },
        walljumps: {
            code: 0x26,
            enabled: checked('walljumps')
        }
    };
}

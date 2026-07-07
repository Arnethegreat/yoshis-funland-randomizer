"use strict";

/**
 * setmodes.js
 * Per-level mode override system.
 *
 * Data model
 * ----------
 * levelOverrides: Array of {
 *   mapSlot  : number  -- world-map slot index (0x00 – 0x47), matches keys in levelNames
 *   levelId  : number  -- actual level to play (0x00 – 0x47)
 *   modes    : object  -- same shape as getModeOptions() return value
 *   label    : string  -- human-readable description (built at save time)
 * }
 *
 * When generateLevelSettings() runs it merges these overrides:
 *   - The mapSlot determines which entry in the settings stream to replace.
 *   - The levelId determines which entry in the level-order table to write.
 *   - modes replaces the global modes for that slot only.
 *
 * A map slot can only have one override entry (adding a second replaces the first).
 */

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

var levelOverrides = [];   // exported — read by settings.js

// The prefix used for all per-level builder controls
var BUILDER_PREFIX = 'plb'; // per-level builder

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return the human-readable name for a level index, or a fallback. */
function getLevelName(index) {
    var hex = '0x' + ('00' + index.toString(16).toUpperCase()).slice(-2);
    var entry = levelNames[hex.toLowerCase()] || levelNames[hex];
    if (!entry) return 'Level 0x' + index.toString(16).toUpperCase();
    if (typeof entry === 'string') return entry;
    if (typeof entry === 'object' && entry.name) return entry.name;
    return 'Level 0x' + index.toString(16).toUpperCase();
}

/** Build a short human-readable summary of the active modes in an options object. */
function summarizeModes(modes) {
    var active = [];
    Object.keys(modes).forEach(function(k) {
        if (modes[k].enabled) active.push(k);
    });
    if (active.length === 0) return 'No modes';
    // Pretty-print a few well-known ones, otherwise just count
    var labels = {
        drunkMode:              'Drunk',
        hardMode:               'One-Hit',
        deathStarCounter:       'Death@0★',
        extendedFlutters:       'Ext. Flutter',
        noFlutters:             'No Flutter',
        reverseControls:        'Reversed',
        speedBoost:             'Speed Boost',
        bouncyCastle:           'Bouncy',
        stickyGround:           'Sticky',
        nothingTongueable:      'No Tongue',
        randomEggCursor:        'Rnd Cursor',
        filledMouth:            'Filled Mouth',
        floorModifier:          'Floor Mod',
        airModifier:            'Air Mod',
        coinModifier:           'Coin Mod',
        flowerModifier:         'Flower Mod',
        scoreRequirementMinimum:'Score Min',
        scoreRequirementMaximum:'Score Max',
        scoreRequirementExact:  'Score Exact',
        walljumps:              'Walljumps'
    };
    return active.map(function(k) { return labels[k] || k; }).join(', ');
}

/** Find the index of an override for a given mapSlot, or -1. */
function findOverrideIndex(mapSlot) {
    for (var i = 0; i < levelOverrides.length; i++) {
        if (levelOverrides[i].mapSlot === mapSlot) return i;
    }
    return -1;
}

// ---------------------------------------------------------------------------
// Builder panel — populate level-select dropdowns
// ---------------------------------------------------------------------------

function populateLevelSelects() {
    var mapSlotSel  = document.getElementById('plb_mapSlot');
    var levelIdSel  = document.getElementById('plb_levelId');
    if (!mapSlotSel || !levelIdSel) return;

    // Only playable slots (exclude score tiles, controller tiles)
    var playableSlots = Object.keys(levelNames).filter(function(hex) {
        var idx = parseInt(hex, 16);
        var entry = levelNames[hex];
        // skip score/controller tiles (those have "W? -" in name)
        if (typeof entry === 'string' && entry.indexOf(' - Score') !== -1) return false;
        if (typeof entry === 'string' && entry.indexOf('Controller') !== -1) return false;
        return true;
    }).sort(function(a, b) { return parseInt(a, 16) - parseInt(b, 16); });

    mapSlotSel.innerHTML  = '';
    levelIdSel.innerHTML  = '';

    playableSlots.forEach(function(hex) {
        var idx  = parseInt(hex, 16);
        var name = getLevelName(idx);
        var opt1 = document.createElement('option');
        opt1.value = idx;
        opt1.textContent = name;
        mapSlotSel.appendChild(opt1);

        var opt2 = document.createElement('option');
        opt2.value = idx;
        opt2.textContent = name;
        levelIdSel.appendChild(opt2);
    });
}

// ---------------------------------------------------------------------------
// Render / update the override list
// ---------------------------------------------------------------------------

function renderOverrideList() {
    var list = document.getElementById('levelOverrideList');
    if (!list) return;

    if (levelOverrides.length === 0) {
        list.innerHTML = '<p class="text-muted small mb-0">No per-level overrides set. Global settings apply to all levels.</p>';
        return;
    }

    list.innerHTML = '';
    levelOverrides.forEach(function(ov, i) {
        var mapName   = getLevelName(ov.mapSlot);
        var levelName = getLevelName(ov.levelId);
        var sameLevel = (ov.mapSlot === ov.levelId);
        var levelLine = sameLevel
            ? ''
            : '<span class="override-level-redirect">→ plays <strong>' + levelName + '</strong></span>';

        var card = document.createElement('div');
        card.className = 'override-card';
        card.dataset.index = i;
        card.innerHTML =
            '<div class="override-card-header">'
            +   '<span class="override-card-slot"><strong>' + mapName + '</strong>' + levelLine + '</span>'
            +   '<div class="override-card-actions">'
            +     '<button class="btn btn-xs btn-outline-secondary override-edit-btn" data-index="' + i + '">Edit</button>'
            +     '<button class="btn btn-xs btn-outline-danger  override-remove-btn" data-index="' + i + '">✕</button>'
            +   '</div>'
            + '</div>'
            + '<div class="override-card-modes small text-muted">' + ov.label + '</div>';
        list.appendChild(card);
    });

    // Event delegation for edit / remove buttons
    list.querySelectorAll('.override-remove-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var idx = parseInt(this.dataset.index);
            levelOverrides.splice(idx, 1);
            renderOverrideList();
        });
    });

    list.querySelectorAll('.override-edit-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var idx = parseInt(this.dataset.index);
            loadOverrideIntoBuilder(idx);
        });
    });
}

// ---------------------------------------------------------------------------
// Load an existing override back into the builder for editing
// ---------------------------------------------------------------------------

function loadOverrideIntoBuilder(index) {
    var ov = levelOverrides[index];
    if (!ov) return;

    // Set map-slot and level-id selects
    document.getElementById('plb_mapSlot').value = ov.mapSlot;
    document.getElementById('plb_levelId').value  = ov.levelId;

    // Restore each control from the saved modes snapshot
    var m = ov.modes;
    var p = BUILDER_PREFIX;

    function setCheck(name, val) {
        var el = document.getElementById(p + '_' + name);
        if (el) el.checked = !!val;
    }
    function setSelect(name, val) {
        var el = document.getElementById(p + '_' + name);
        if (el) el.value = val || '';
    }
    function setRadio(group, val) {
        var el = document.querySelector('input[name="' + p + '_' + group + '"][value="' + val + '"]');
        if (el) el.checked = true;
        // Fire change to update dependent controls
        var changeEv = document.createEvent('Event');
        changeEv.initEvent('change', true, true);
        if (el) el.dispatchEvent(changeEv);
    }
    function setNumber(name, val) {
        var el = document.getElementById(p + '_' + name);
        if (el) el.value = val;
    }

    setCheck('drunkMode',        m.drunkMode        && m.drunkMode.enabled);
    setCheck('hardMode',         m.hardMode         && m.hardMode.enabled);
    setCheck('deathStarCounter', m.deathStarCounter && m.deathStarCounter.enabled);
    setCheck('extendedFlutters', m.extendedFlutters && m.extendedFlutters.enabled);
    setCheck('noFlutters',       m.noFlutters       && m.noFlutters.enabled);
    setCheck('reverseControls',  m.reverseControls  && m.reverseControls.enabled);
    setCheck('walljumps',        m.walljumps        && m.walljumps.enabled);
    setCheck('speedBoost',       m.speedBoost       && m.speedBoost.enabled);
    setCheck('bouncyCastle',     m.bouncyCastle     && m.bouncyCastle.enabled);
    setCheck('stickyGround',     m.stickyGround     && m.stickyGround.enabled);
    setCheck('nothingTongueable',m.nothingTongueable && m.nothingTongueable.enabled);
    setCheck('randomEggCursor',  m.randomEggCursor  && m.randomEggCursor.enabled);

    setSelect('floorModifier',           ov._raw ? ov._raw.floorModifier   : '');
    setSelect('airModifier',             ov._raw ? ov._raw.airModifier     : '');
    setSelect('coinModifier',            ov._raw ? ov._raw.coinModifier    : '');
    setSelect('flowerModifier',          ov._raw ? ov._raw.flowerModifier  : '');
    setSelect('filledMouth',             ov._raw ? ov._raw.filledMouth     : '');
    setSelect('speedBoostAcceleration',  ov._raw ? ov._raw.speedBoostAcceleration  : 'accelerateMedium');
    setSelect('speedBoostMaximumSpeed',  ov._raw ? ov._raw.speedBoostMaximumSpeed  : 'maximumSpeedMedium');

    var scoreType = 'none';
    if (m.scoreRequirementMinimum && m.scoreRequirementMinimum.enabled) scoreType = 'minimum';
    else if (m.scoreRequirementMaximum && m.scoreRequirementMaximum.enabled) scoreType = 'maximum';
    else if (m.scoreRequirementExact   && m.scoreRequirementExact.enabled)   scoreType = 'exact';
    setRadio('scoreRequirementType', scoreType);
    if (ov._raw) setNumber('scoreRequirementScore', ov._raw.scoreRequirementScore || 10);

    // Re-trigger dependent UI
    var speedBoostEl = document.getElementById(p + '_speedBoost');
    if (speedBoostEl) speedBoostEl.dispatchEvent(new Event('change'));

    // Scroll builder into view and tag it as editing this index
    var builder = document.getElementById('levelOverrideBuilder');
    if (builder) {
        builder.dataset.editingIndex = index;
        builder.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    document.getElementById('plb_applyBtn').textContent = 'Update Override';
}

// ---------------------------------------------------------------------------
// Apply (add or update) button handler
// ---------------------------------------------------------------------------

function applyLevelOverride() {
    var mapSlot = parseInt(document.getElementById('plb_mapSlot').value);
    var levelId = parseInt(document.getElementById('plb_levelId').value);
    var modes   = getModeOptions(BUILDER_PREFIX);

    // Save raw select values so edit can restore them exactly
    var raw = {
        floorModifier:           document.getElementById(BUILDER_PREFIX + '_floorModifier').value,
        airModifier:             document.getElementById(BUILDER_PREFIX + '_airModifier').value,
        coinModifier:            document.getElementById(BUILDER_PREFIX + '_coinModifier').value,
        flowerModifier:          document.getElementById(BUILDER_PREFIX + '_flowerModifier').value,
        filledMouth:             document.getElementById(BUILDER_PREFIX + '_filledMouth').value,
        speedBoostAcceleration:  document.getElementById(BUILDER_PREFIX + '_speedBoostAcceleration').value,
        speedBoostMaximumSpeed:  document.getElementById(BUILDER_PREFIX + '_speedBoostMaximumSpeed').value,
        scoreRequirementScore:   parseInt(document.getElementById(BUILDER_PREFIX + '_scoreRequirementScore').value)
    };

    var label = summarizeModes(modes);

    var entry = { mapSlot: mapSlot, levelId: levelId, modes: modes, label: label, _raw: raw };

    var builder = document.getElementById('levelOverrideBuilder');
    var editingIndex = builder && builder.dataset.editingIndex !== undefined && builder.dataset.editingIndex !== ''
        ? parseInt(builder.dataset.editingIndex)
        : -1;

    if (editingIndex >= 0) {
        levelOverrides[editingIndex] = entry;
        builder.dataset.editingIndex = '';
        document.getElementById('plb_applyBtn').textContent = 'Add Override';
    } else {
        // Replace existing override for the same slot, or append
        var existing = findOverrideIndex(mapSlot);
        if (existing >= 0) {
            levelOverrides[existing] = entry;
        } else {
            levelOverrides.push(entry);
        }
    }

    renderOverrideList();
}

// ---------------------------------------------------------------------------
// Initialise on DOM ready
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Populate selects
    populateLevelSelects();

    // Sync levelId select to mapSlot by default (common case: same level, change modes only)
    var mapSlotSel = document.getElementById('plb_mapSlot');
    var levelIdSel = document.getElementById('plb_levelId');
    if (mapSlotSel && levelIdSel) {
        mapSlotSel.addEventListener('change', function() {
            levelIdSel.value = mapSlotSel.value;
        });
    }

    // Render mode controls into builder
    var builderControls = document.getElementById('plb_modeControls');
    if (builderControls) {
        renderModeControls(BUILDER_PREFIX, builderControls);
    }

    // Apply button
    var applyBtn = document.getElementById('plb_applyBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyLevelOverride);
    }

    // Render initially empty list
    renderOverrideList();
});

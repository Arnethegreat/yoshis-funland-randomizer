"use strict";

/**
 * saveload.js
 * ---------------------------------------------------------------------------
 * Save / Load / Preset system for Yoshi's Funland Randomizer.
 *
 * Save format (JSON):
 * {
 *   _version           : 1           -- bumped if the schema ever changes
 *   seed               : number
 *   randomizeLevelOrder: boolean
 *   keepCastleOrder    : boolean
 *   includeExtras      : boolean
 *   globalModes        : object      -- collectRawForPrefix('global') output
 *   levelOverrides     : array of {
 *     mapSlot : number
 *     levelId : number
 *     label   : string
 *     _raw    : object               -- collectRawForPrefix output for this slot
 *   }
 * }
 *
 * Extending: add new top-level keys to collectSettings() and applySettings().
 * The _version field lets future code detect old saves and migrate them.
 */

var SETTINGS_VERSION = 1;

// ---------------------------------------------------------------------------
// Collect all current settings into a plain serialisable object
// ---------------------------------------------------------------------------

function collectSettings() {
    var seed = document.getElementById('randomSeed');
    var randLevel = document.getElementById('randomizeLevelOrder');
    var keepCastle = document.getElementById('keepCastleOrder');
    var incExtras = document.getElementById('includeExtras');

    // Collect per-level overrides — strip the computed `modes` object (derived
    // from _raw at load time) and keep only the serialisable parts.
    var overrideData = (typeof levelOverrides !== 'undefined' ? levelOverrides : []).map(function(ov) {
        return {
            mapSlot: ov.mapSlot,
            levelId: ov.levelId,
            label:   ov.label || '',
            _raw:    ov._raw  || {}
        };
    });

    return {
        _version:            SETTINGS_VERSION,
        seed:                seed    ? parseInt(seed.value)        : 0,
        randomizeLevelOrder: randLevel  ? randLevel.checked        : false,
        keepCastleOrder:     keepCastle ? keepCastle.checked       : true,
        includeExtras:       incExtras  ? incExtras.checked        : false,
        globalModes:         collectRawForPrefix(GLOBAL_PREFIX),
        levelOverrides:      overrideData
    };
}

// ---------------------------------------------------------------------------
// Apply a settings object to all UI controls
// ---------------------------------------------------------------------------

function applySettings(s) {
    if (!s || typeof s !== 'object') return;

    // ── Basic controls ───────────────────────────────────────────────────────
    var seed = document.getElementById('randomSeed');
    if (seed && s.seed !== undefined) seed.value = s.seed;

    var randLevel = document.getElementById('randomizeLevelOrder');
    if (randLevel && s.randomizeLevelOrder !== undefined) randLevel.checked = s.randomizeLevelOrder;

    var keepCastle = document.getElementById('keepCastleOrder');
    if (keepCastle && s.keepCastleOrder !== undefined) keepCastle.checked = s.keepCastleOrder;

    var incExtras = document.getElementById('includeExtras');
    if (incExtras && s.includeExtras !== undefined) incExtras.checked = s.includeExtras;

    // ── Global mode controls ─────────────────────────────────────────────────
    if (s.globalModes) {
        applyRawModesToPrefix(s.globalModes, GLOBAL_PREFIX);
    }

    // ── Per-level overrides ──────────────────────────────────────────────────
    if (typeof levelOverrides !== 'undefined' && Array.isArray(s.levelOverrides)) {
        levelOverrides.length = 0; // clear in place (preserves the reference)

        s.levelOverrides.forEach(function(ov) {
            if (ov.mapSlot === undefined || ov.levelId === undefined) return;

            // Derive the computed modes object from the stored _raw values
            var restoredModes = {};
            if (ov._raw) {
                // Temporarily push _raw into the builder and read back the full
                // modes object — this ensures parameters are recomputed correctly.
                // We use the BUILDER_PREFIX panel that's already in the DOM.
                applyRawModesToPrefix(ov._raw, BUILDER_PREFIX);
                restoredModes = getModeOptions(BUILDER_PREFIX);
            }

            levelOverrides.push({
                mapSlot: ov.mapSlot,
                levelId: ov.levelId,
                label:   ov.label || summarizeModes(restoredModes),
                modes:   restoredModes,
                _raw:    ov._raw || {}
            });
        });

        // Re-render the list
        if (typeof renderOverrideList === 'function') renderOverrideList();
    }
}

// ---------------------------------------------------------------------------
// Save — serialise to JSON and trigger a file download
// ---------------------------------------------------------------------------

function saveSettingsToFile() {
    var data = collectSettings();
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var ts   = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
    saveAs(blob, 'yoshfun_settings_' + ts + '.json');
}

// ---------------------------------------------------------------------------
// Load — read a JSON file the user chooses
// ---------------------------------------------------------------------------

function loadSettingsFromFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            applySettings(data);
            _showSaveLoadMessage('Settings loaded.', 'success');
        } catch (err) {
            _showSaveLoadMessage('Could not read file: ' + err.message, 'danger');
        }
    };
    reader.readAsText(file);
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

function populatePresetSelect() {
    var sel = document.getElementById('presetSelect');
    if (!sel || typeof PRESETS === 'undefined') return;

    // Keep the placeholder option, then add presets
    PRESETS.forEach(function(p) {
        var opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        sel.appendChild(opt);
    });

    // Show description when selection changes
    sel.addEventListener('change', function() {
        _updatePresetDescription(this.value);
    });
}

function loadSelectedPreset() {
    var sel = document.getElementById('presetSelect');
    if (!sel || !sel.value) return;

    var preset = null;
    if (typeof PRESETS !== 'undefined') {
        for (var i = 0; i < PRESETS.length; i++) {
            if (PRESETS[i].id === sel.value) { preset = PRESETS[i]; break; }
        }
    }
    if (!preset) return;

    // Build a full settings object from the preset's partial globalModes spec.
    // Unspecified keys default to "off" / false.
    var raw = _presetModesToRaw(preset.settings.globalModes || {});

    var fullSettings = {
        _version:            SETTINGS_VERSION,
        randomizeLevelOrder: preset.settings.randomizeLevelOrder !== undefined ? preset.settings.randomizeLevelOrder : true,
        keepCastleOrder:     preset.settings.keepCastleOrder     !== undefined ? preset.settings.keepCastleOrder     : true,
        includeExtras:       preset.settings.includeExtras       !== undefined ? preset.settings.includeExtras       : false,
        globalModes:         raw,
        levelOverrides:      preset.settings.levelOverrides || []
    };

    // Only set seed if preset explicitly provides one
    if (preset.settings.seed !== undefined) fullSettings.seed = preset.settings.seed;

    applySettings(fullSettings);
    _showSaveLoadMessage('Preset "' + preset.name + '" loaded.', 'success');
    _updatePresetDescription(sel.value);
}

/**
 * Convert a preset's compact globalModes spec (where absent keys mean "off")
 * into a full raw object that applyRawModesToPrefix() can consume.
 */
function _presetModesToRaw(spec) {
    return {
        drunkMode:              !!spec.drunkMode,
        hardMode:               !!spec.hardMode,
        deathStarCounter:       !!spec.deathStarCounter,
        extendedFlutters:       !!spec.extendedFlutters,
        noFlutters:             !!spec.noFlutters,
        reverseControls:        !!spec.reverseControls,
        walljumps:              !!spec.walljumps,
        speedBoost:             !!spec.speedBoost,
        bouncyCastle:           !!spec.bouncyCastle,
        stickyGround:           !!spec.stickyGround,
        nothingTongueable:      !!spec.nothingTongueable,
        randomEggCursor:        !!spec.randomEggCursor,
        floorModifier:          spec.floorModifier          || '',
        airModifier:            spec.airModifier            || '',
        coinModifier:           spec.coinModifier           || '',
        flowerModifier:         spec.flowerModifier         || '',
        filledMouth:            spec.filledMouth            || '',
        speedBoostAcceleration: spec.speedBoostAcceleration || 'accelerateMedium',
        speedBoostMaximumSpeed: spec.speedBoostMaximumSpeed || 'maximumSpeedMedium',
        scoreRequirementType:   spec.scoreRequirementType   || 'none',
        scoreRequirementScore:  spec.scoreRequirementScore  !== undefined ? spec.scoreRequirementScore : 10
    };
}

function _updatePresetDescription(id) {
    var box = document.getElementById('presetDescription');
    if (!box) return;
    var preset = null;
    if (typeof PRESETS !== 'undefined') {
        for (var i = 0; i < PRESETS.length; i++) {
            if (PRESETS[i].id === id) { preset = PRESETS[i]; break; }
        }
    }
    box.textContent = preset ? preset.description : '';
    box.style.display = preset ? '' : 'none';
}

// ---------------------------------------------------------------------------
// Status message
// ---------------------------------------------------------------------------

function _showSaveLoadMessage(msg, type) {
    var el = document.getElementById('saveLoadMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = 'saveload-message saveload-message--' + (type || 'success');
    el.style.display = '';
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function() {
        el.style.display = 'none';
    }, 3500);
}

// ---------------------------------------------------------------------------
// DOM wiring on ready
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    populatePresetSelect();

    // Load preset button
    var loadPresetBtn = document.getElementById('loadPresetBtn');
    if (loadPresetBtn) loadPresetBtn.addEventListener('click', loadSelectedPreset);

    // Save button
    var saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveSettingsToFile);

    // Load file input — trigger the hidden file input on button click
    var loadBtn = document.getElementById('loadSettingsBtn');
    var loadInput = document.getElementById('loadSettingsInput');
    if (loadBtn && loadInput) {
        loadBtn.addEventListener('click', function() { loadInput.click(); });
        loadInput.addEventListener('change', function() {
            loadSettingsFromFile(this.files[0]);
            this.value = ''; // reset so same file can be reloaded
        });
    }

    // Hide description box initially
    var descBox = document.getElementById('presetDescription');
    if (descBox) descBox.style.display = 'none';

    // Hide message initially
    var msgEl = document.getElementById('saveLoadMessage');
    if (msgEl) msgEl.style.display = 'none';
});

const presets = require('ts-jest/dist/presets/all-presets');

// Some module systems wrap the export under `.default`.
const allPresets = presets?.default ?? presets;

module.exports = allPresets.defaults;

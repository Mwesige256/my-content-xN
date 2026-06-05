const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Polyfill for older Node versions
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function() {
    return this.slice().reverse();
  };
}

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });

const fs = require("fs");
const path = require("path");
const config = require("./index.json");

const distPath = path.resolve(__dirname, config.settings.VENCORD_DIST, "dist", "vencordDesktopMain.js");

if (fs.existsSync(distPath)) {
    queueMicrotask(() => require(distPath));
} else {
    console.log("[Vencord Loader] Vencord dist not found!");
}

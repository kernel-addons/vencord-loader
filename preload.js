const fs = require("fs");
const path = require("path");
const config = require("./index.json");
const {webFrame} = require("electron");

const preloadPath = path.resolve(__dirname, config.settings.VENCORD_DIST, "dist", "vencordDesktopPreload.js");
const rendererPath = path.resolve(__dirname, config.settings.VENCORD_DIST, "dist", "renderer.js");

if (fs.existsSync(preloadPath)) {
    require(preloadPath);
    
    let renderer = fs.readFileSync(rendererPath, "utf8");

    if (fs.existsSync(path.resolve(__dirname, "..", "ultra"))) {
        renderer = renderer.replace(/(WebpackInterceptor[\s\S]+Object\.defineProperty\(window),\s?[\w]+,/, `$1, "\\$\\$VENCORD_WEBPACK_SPOOF",`);
    }

    webFrame.top.executeJavaScript(renderer);
} else {
    console.log("[Vencord Loader] couldn't find preload script!");
}

const fs = require("fs");
const path = require("path");
const config = require("./index.json");
const {webFrame} = require("electron");

const distPath = path.resolve(__dirname, config.settings.VENCORD_DIST, "dist", "preload.js");

// Make it something that doesn't run anything
process.env.DISCORD_PRELOAD = path.resolve(process.cwd(), "resources/build_info.json");

// This is extremely cursed, but does it's job of keeping everything running
webFrame.top.executeJavaScript(`
    if (window.ultra) {
        const origDefine = Object.defineProperty;

        Object.defineProperty = function (obj, k, desc) {
            if (desc.set?.toString().includes("Patching ")) {
                const set = desc.set;
                onceWebpackPollute(set);

                Object.defineProperty = origDefine;
            } else {
                return origDefine(obj, k, desc);
            }
        }
    }
`);

if (fs.existsSync(distPath)) {
    require(distPath);
} else {
    console.log("[Vencord Loader] couldn't find preload script!");
}

const fs = require("fs");
const path = require("path");
const Module = require("module");
const config = require("./index.json");

const distPath = path.resolve(__dirname, config.settings.VENCORD_DIST, "dist", "patcher.js");

if (fs.existsSync(distPath)) {
    queueMicrotask(() => {
        const _load = Module._load;

        Module._load = function (mod) {
            if (mod.includes(`app-original.asar${path.sep}app.asar${path.sep}package.json`)) {
                return _load.apply(this, [mod.replace("app.asar" + path.sep, ""), ...[...arguments].slice(1)]);
            }

            return _load.apply(this, arguments);
        }

        require(distPath);
    });

    const original = Module._extensions[".js"];

    Module._extensions[".js"] = function (mod, filename) {
        if (mod.id?.endsWith("patcher.js")) {
            let content = fs.readFileSync(filename, "utf8");
            content = content.replace(`require(require.main.filename)`, "");
            content = content.replace(/delete require\.cache\[\w\]\.exports,require\.cache\[\w\]\.exports=\{\.\.\.\w\.default,BrowserWindow:\w\},/, "");

            return mod._compile(content, filename);
        }

        return original.apply(this, arguments);
    }

} else {
    console.log("[Vencord Loader] Vencord dist not found!");
}

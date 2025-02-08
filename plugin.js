const fs = require("fs")
let color;
try {
    color = require("./colors.json");
} catch (err) {
    console.error("Colors file not found or invalid!");
    color = { red: "\x1b[31m", green: "\x1b[32m" };
}
const log = require("./log.js");
const textToLang = require("./lang/lang.js");

const https = require('https');
const path = require("path");

async function checkNpmPackageVersion(lang) {
    try {
        const localData = await fs.promises.readFile(path.join(__dirname, "package.json"), "utf8");
        const localVersion = JSON.parse(localData).version;
        https.get("https://registry.npmjs.org/oxzof-aoijs-plugin", (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const packageInfo = JSON.parse(data);
                const latestVersion = packageInfo['dist-tags'].latest;
                if (localVersion !== latestVersion) {
                    log(color.blue,`[OXZOF AOI PLUGIN] ${textToLang("new_version_available",lang)}`);
                }
            });
        }).on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
        });
    } catch (error) {
        console.error(`Error reading package.json: ${error.message}`);
    }
}




class Plugin {
    constructor(client, lang = "en") {
        this.client = client;
        this.lang = lang;
    }
    getClient() {
        console.log(this.client);
    }
    async extras() {
        await require("./src/extraFunctions.js")(this.client) ? log(color.green, textToLang("extra_loaded", this.lang)) : null;
    }
    async variable(file = false) {
        await require("./src/variableFile.js")(this.client, file, this.lang) ? log(color.green, textToLang("variable_loaded", this.lang)) : null;
    }
    async commands(folder = false) {
        await require("./src/commands.js")(this.client, folder, this.lang) ? log(color.green, textToLang("commands_loaded", this.lang)) : null;
    }

    async customFunctions(folder = false) {
        await require("./src/customFunctions.js")(this.client, folder, this.lang) ? log(color.green, textToLang("customfunctions_loaded", this.lang)) : null;
    }
}


const factory = (client, lang = "en") => {
    const validLanguages = ["en", "tr"];
    if (!validLanguages.includes(lang)) {
        log(color.yellow, `Invalid language "${lang}", defaulting to "en"`);
        lang = "en";
    }
    if (!client) {
        log(color.red, textToLang("empty_token", lang))
        return;
    }
    checkNpmPackageVersion(lang)
    const plugin = new Plugin(client, lang);
    log(color.yellow, textToLang("trailer", lang))
    return plugin;
}

module.exports = factory;
// main page
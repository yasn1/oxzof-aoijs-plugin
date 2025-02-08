const fs = require("fs");
const log = require("../log");
const path = require("path");
const textToLang = require("../lang/lang.js");
const { LoadCommands } = require("aoi.js");
let color;
try {
    color = require("../colors.json");
} catch (err) {
    console.error("Colors file not found or invalid!");
    color = { red: "\x1b[31m", green: "\x1b[32m" };
}

const commands = (client, folder, lang) => {
    if (!folder || typeof folder !== "string") {
        log(color.red, "Invalid folder path provided: " + folder);
        return false;
    }

    const folderPath = path.join(process.cwd(), folder);

    if (!fs.existsSync(folderPath)) {
        log(color.red, textToLang("customfunction_folder_error", lang) + " (" + folderPath + ")");
        return false;
    }

    try {
        const files = fs.readdirSync(folderPath);
        const results = [];

        files.forEach(file => {
            const fullPath = path.join(folderPath, file);

            try {
                const stats = fs.statSync(fullPath);
                if (stats.isFile() && path.extname(fullPath) === ".js") {
                    const content = require(fullPath);
                    if(Array.isArray(content)){
                        content.map((x) => {
                            if (x.name && x.type && typeof x.code === "function") {
                                results.push(x);
                            } else {
                                log(color.red, `${textToLang("customFunction_file_format_error",lang)} ${file}`);
                            }
                        })
                    }else{
                        if (content.name && content.type && typeof content.code === "function") {
                            results.push(content);
                        } else {
                            log(color.red, `${textToLang("customFunction_file_format_error",lang)} ${file}`);
                        }
                    }
                    
                }
            } catch (err) {
                log(color.red, `${textToLang("customFunction_file_load_error",lang)} ${file}, ${err.message}`);
            }
        });

        if (results.length === 0) {
            log(color.red, textToLang("customfunction_folder_empty", lang));
            return false;
        }
        results.forEach(obj => client.functionManager.createFunction(obj));
        return true;
        
    } catch (err) {
        log(color.red, `Unexpected error: ${err.message}`);
        return false;
    }
};
module.exports = commands
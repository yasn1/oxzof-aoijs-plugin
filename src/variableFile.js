const fs = require("fs");
const log = require("../log");
const path = require("path");
const textToLang = require("../lang/lang.js");
let color;
    try {
        color = require("../colors.json");
    } catch (err) {
        console.error("Colors file not found or invalid!");
        color = { red: "\x1b[31m", green: "\x1b[32m" };
    }

const vars = (client,file,lang) => {
    if(!fs.existsSync(path.join(file))){
        log(color.red,textToLang("variable_file_error",lang)+" ("+file+")")
        return;
    }
    if(!file.endsWith(".json")){
        log(color.red,textToLang("variable_file_format_error",lang))
        return;
    }
    try{
        const data = JSON.parse(fs.readFileSync(path.join(file),"utf8"));
        client.variables(data)
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = vars;
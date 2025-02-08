const fs = require("fs");
const log = require("../log.js");
let color;
try {
    color = require("../colors.json");
} catch (err) {
    console.error("Colors file not found or invalid!");
    color = { red: "\x1b[31m", green: "\x1b[32m" };
}
const textToLang = (text,lang) => {
    try{
        const datafile = JSON.parse(fs.readFileSync(__dirname+"/"+lang+".json","utf8"));
        return datafile[text] || "INVALID_TEXT_KEY";
    }catch(err){
        log(color.red,`Plugin Error! valid languages "en" and "tr"`);
        console.error(err)
        return "INVALID_TEXT_KEY";
    }
}

module.exports = textToLang;
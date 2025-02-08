const fs = require("fs");
const log = require("../log");
const path = require("path");
const textToLang = require("../lang/lang.js");
const {LoadCommands} = require("aoi.js");
let color;
    try {
        color = require("../colors.json");
    } catch (err) {
        console.error("Colors file not found or invalid!");
        color = { red: "\x1b[31m", green: "\x1b[32m" };
    }

const commands = (client, folder, lang) => {
    if(!fs.existsSync(path.join(folder))){
        log(color.red,textToLang("commands_folder_error",lang)+" ("+folder+")")
        return;
    }
    try{
        const loader = new LoadCommands(client);
        loader.load(client.cmd, path.join(folder),false);
        return true;
    }catch(err){
        log(color.red,log.message)
        return false;
    }
}
module.exports = commands
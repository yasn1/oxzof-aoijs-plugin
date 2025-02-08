const log = (...args) => {
    const resetColor = "\x1b[0m";
    const formattedArgs = args.length > 1 ? [`${args.map(String).join("") + resetColor}`] : args
    console.log(...formattedArgs);
}
module.exports = log;
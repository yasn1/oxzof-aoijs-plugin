function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[b.length][a.length];
}

function similarity(a, b) {
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : (1 - distance / maxLen);
}

function findBestMatches(mainString, possibilities) {
    const ratings = possibilities.map(str => ({
        target: str,
        rating: similarity(mainString.toLowerCase(), str.toLowerCase())
    }));
    ratings.sort((a, b) => b.rating - a.rating);
    return ratings;
}

const extras = (client) => {
    try {

        client.functionManager.createFunction({
            name: "$botListGuild",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                const [sep = ","] = data.inside.splits;

                const guildNames = d.client.guilds.cache.map(guild => guild.name);

                data.result = guildNames.join(sep);

                return {
                    code: d.util.setCode(data)
                };
            }
        }, {
            name: "$findUpperChars",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                const [text, sep = null] = data.inside.splits;
                if (!sep) {
                    const regex = /[A-ZĞÜŞİÖÇ ]/g;
                    const letters = text.match(regex)
                    data.result = letters.length > 0 ? letters.join("").trim() : null
                } else {
                    const regex = /[A-ZĞÜŞİÖÇ]/g;
                    const letters = text.match(regex)
                    data.result = letters.length > 0 ? letters.join(sep).trim() : null
                }
                return {
                    code: d.util.setCode(data)
                };
            }
        }, {
            name: "$findLowerChars",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                const [text, sep = null] = data.inside.splits;
                if (!sep) {
                    const regex = /[a-zğüşıöç ]/g;
                    const letters = text.match(regex)
                    data.result = letters.join("").trim()
                } else {
                    const regex = /[a-zğüşıöç]/g;
                    const letters = text.match(regex)
                    data.result = letters.join(sep).trim()
                }
                return {
                    code: d.util.setCode(data)
                };
            }

        }, {
            name: "$matchRegex",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                let [sentence, placeholder] = data.inside.splits;
                const placeholders = {
                    number: '([0-9]+)',
                    string: '([a-zA-Z]+)',
                    boolean: '(true|false)',
                    any: '(\\S+)'
                };
                const dynamicRegex = placeholder.replace(/\{(any|number|string|boolean)\}/gu, (_, key) => placeholders[key]);
                const regex = new RegExp(dynamicRegex, 'i');
                const match = sentence.match(regex);

                if (match) {
                    data.result = match[0];
                } else {
                    data.result = null;
                }
                return {
                    code: d.util.setCode(data)
                };
            }
        }, {
            name: "$toUnixTime",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                const [dateFormat, timezone = null] = data.inside.splits;
                const moment = require('moment-timezone');

                let times;
                let index;
                if (timezone) {
                    times = moment.tz.names();
                    index = times.findIndex(x => x == timezone);
                    if (index == -1) {
                        data.result = null;
                        return {
                            code: d.util.setCode(data)
                        }
                    }
                }
                let TIMEZONE = timezone ? times[index] : "UTC";
                const hasDate = dateFormat.match(/\d{2}-\d{2}-\d{4}/);
                const hasTime = dateFormat.match(/\d{2}(:|#COLON#)\d{2}((:|#COLON#)\d{2})?/);
                if (hasDate && hasTime) {
                    dateTimeString = `${hasDate[0]} ${hasTime[0]}`;
                } else if (hasDate) {
                    dateTimeString = `${hasDate[0]} 00:00:00`;
                } else if (hasTime) {
                    const today = moment().tz(TIMEZONE).format('DD-MM-YYYY');
                    dateTimeString = `${today} ${hasTime[0]}`;
                }
                const momentDate = moment.tz(dateTimeString, "DD-MM-YYYY HH:mm:ss", TIMEZONE);
                if (!momentDate.isValid()) {
                    data.result = null;
                } else {
                    data.result = momentDate.unix();
                }
                return {
                    code: d.util.setCode(data)
                };
            }
        }, {
            name: "$isValidClientToken",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                const token = data.inside.trim();

                const axios = require("axios");

                try {
                    const res = await axios.get("https://discord.com/api/v10/users/@me", {
                        headers: {
                            Authorization: `Bot ${token}`
                        }
                    })
                    
                    data.result = "true";
                } catch (err) {
                    data.result = "false";
                }

                return {
                    code: d.util.setCode(data)
                };
            }

        }, {
            name: "$jsonValueEscape",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                const [text] = data.inside.splits;

                data.result = text
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r')
                    .replace(/\t/g, '\\t');
                return {
                    code: d.util.setCode(data)
                };
            }
        }, {
            name: "$alternativeCommands",
            type: "djs",
            code: async d => {
                const data = d.util.aoiFunc(d);
                const [command, type = "all", max = "10", splitter = ", ", getAliases = "true", filters = "$alwaysExecute, AndMore"] = data.inside.splits;
                const types = d.client.loader.paths[0].commandsLocation.types;
                types.push("all")
                if (!command) {
                    return d.aoiError.fnError(d, "custom", { inside: data.inside }, ":x: No command provided for $alternativeCommands.");
                }
                if (!types.includes(type)) {
                    return d.aoiError.fnError(d, "custom", { inside: data.inside }, ":x: Invalid type provided for $alternativeCommands. Available types: " + types.join(", "));
                }
                if (parseInt(max) == 0 || parseInt(max) < -1 || isNaN(parseInt(max))) {
                    return d.aoiError.fnError(d, "custom", { inside: data.inside }, ":x: Invalid max value provided for $alternativeCommands. Must be greater than -1 or 0.");
                }
                let commands = [];
                d.client.loader.paths.forEach(path => {
                    if (type === "all") {
                        types.forEach(t => {
                            if (t == "all") return;
                            const map = path.commandsLocation[t];
                            console.log(map)
                            if (map instanceof Map) {
                                commands.push(...Array.from(map.values()).map(cmd => cmd?.name));

                                Array.from(map.values()).forEach(cmd => {
                                    const aliases = Array.isArray(cmd.aliases) ? cmd.aliases : [cmd?.aliases];
                                    aliases.forEach(alias => {
                                        if (alias && getAliases == "true") commands.push(alias);
                                    });
                                });
                            }
                        });
                    } else {
                        const container = path.commandsLocation[type];

                        if (container && typeof container === 'object') {
                            const maps = Object.values(container).filter(value => value instanceof Map);
                            if (maps.length > 0) {
                                maps.forEach(map => {
                                    commands.push(...Array.from(map.values()).map(cmd => cmd?.name).filter(Boolean));

                                    Array.from(map.values()).forEach(cmd => {
                                        let aliases = cmd?.aliases;
                                        if (!aliases) return;
                                        if (!Array.isArray(aliases)) aliases = [aliases];

                                        aliases.forEach(alias => {
                                            if (alias && getAliases == "true") commands.push(alias);
                                        });
                                    });
                                });
                            } else {
                                commands.push(...Array.from(path.commandsLocation[type].values()).map(cmd => cmd?.name));
                                path.commandsLocation[type].map(cmd => cmd?.aliases).forEach((item) => {
                                    if (item) {
                                        if (!Array.isArray(item)) item = [item];
                                        item.map(alias => {
                                            if (getAliases == "true") { commands.push(alias); }
                                        })
                                    }
                                })
                            }
                        }
                    }
                })
                filters.split(", ").forEach(filterItem => {
                    commands = commands.filter(cmd => cmd !== filterItem)
                })
                const matches = findBestMatches(command, commands);
                if (max == -1) {
                    data.result = matches.map(match => match.target).join(splitter);
                } else {
                    data.result = matches.slice(0, parseInt(max)).map(match => match.target).join(splitter);
                }
                return {
                    code: d.util.setCode(data)
                };
            }
        });
        return true;
    } catch (err) {
        return false;
    }
}
module.exports = extras;

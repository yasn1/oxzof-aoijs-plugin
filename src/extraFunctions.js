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
        },{
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
                    });
        
                    // Token geçerli
                    data.result = "true";
                } catch (err) {
                    // Token geçersiz veya başka hata
                    data.result = "false";
                }
        
                return {
                    code: d.util.setCode(data)
                };
            }
      },{
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
        });
        return true;
    } catch (err) {
        return false;
    }
}
module.exports = extras;

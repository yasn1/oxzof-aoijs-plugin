# Aoi.js Plugin
This aoi.js plugin offers extra commands and streamlined functions.
`npm install oxzof-aoijs-plugin`


## Setup
```javascript


const client = new AoiClient({ ... }); // Your client

const plugin = require("oxzof-aoijs-plugin")(client,"en"); // Only tr and en languages ​​available

plugin.extras(); // Load extra aoi functions.
plugin.variable("./variables.json"); // Manage variables from file.
plugin.commands("./commands"); // Easily select the folder containing your commands.
plugin.customFunctions("./customFunctions"); // Specify a folder for your custom functions.

```

# Extra Aoi Functions

| Function | Description |
| --- | --- |
| $botListGuild[(seperator)] | Returns the servers where the bot is located. |
| $findUpperChars[text;(seperator)] | Find only capital letters from the text. |
| $findLowerChars[text;(seperator)] | Find only lowercase letters from the text. |
| $matchRegex[text;regex] | Simplify your text processing. |
| $toUnixTime[format;(timezone)] | Get unix timestamp of specific date. |
| $isValidClientToken[token] | Checks the validity of the entered bot token. |
| $jsonValueEscape[text] | Escapes special characters in JSON values. |

## Examples
```php
$botListGuild[, ] # guild1, guild 2, guild 3...

$findUpperChars[Hi Everyone This Is MAGIC] # H E T I MAGIC

$findLowerChars[Hi Everyone This Is MAGIC] # i veryone his s

{number}, {string}, {boolean}, {any}
$matchRegex[i will come to you in 10 seconds. wait for me.;{number} seconds] # 10 seconds
$matchRegex[my favori emoji is: <:oxzof_Close:1310005335276257351> i like it!;emoji is: {any}] # emoji is: <:oxzof_Close:1310005335276257351>
etc...


$toUnixTime[20-12-2026 20:00:00;Europe/Istanbul] # 1797786000
$toUnixTime[20-12-2026;Europe/Istanbul] # 1797714000 (day from 00:00)
$toUnixTime[20:00:00;Europe/Istanbul] # 1736701200 (starting from 20:00 today)

$isValidClientToken[ClientToken] // return true or false


$jsonValueEscape[hello "there" this is potato] // return hello \"there\" this is potato
```


# customFunctions Format:
```javascript
// ./customFunctions/test.js
module.exports = [
    {
        name: "$test",
        type: "djs",
        code: async d => {
            const data = d.util.aoiFunc(d);
            const [] = data.inside.splits;
            data.result = "hi dear";
            return {
                code: d.util.setCode(data)
            };
        };
    },{
        name: "$test2",
        type: "djs",
        code: async d => {
            const data = d.util.aoiFunc(d);
            const [] = data.inside.splits;
            data.result = "hi honey";
            return {
                code: d.util.setCode(data)
            };
        };
    };
];
```


```javascript
// ./customFunctions/object_test.js
// You can also do it using just objects
module.exports = {
    name: "$test",
    type: "djs",
    code: async d => {
        const data = d.util.aoiFunc(d);
        const [] = data.inside.splits;
        data.result = "test";
        return {
            code: d.util.setCode(data)
        };
    };
};

```
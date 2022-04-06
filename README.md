# Easy Discord Bot
An easy way to make a discord bot with nodeJS

# Install
Download this repo before run command below

```sh
cd /path/to/this/repo
npm install
```

# Initlizing
Make a file named `bot.token` with your discord bot token in it

# Adding Commands
`It has a sample ping command in moudles directory`

Make a javascript file in `modules` directory named `[Your Command Name].js`
and put
```javascript
export default class [Your Command Name] {
    constructor() {
        this.name = '[Your Command Name]'; // Name only supports lowercase
                                           // this name will be /[Your Command Name]
        this.description = '[Your Command Description]';
        
        // Your command argvs
        this.options = [
            {
                name: '[Option Name]',
                description: '[Option Description]',
                required: true, // true || false
                type: '[Option Type]'
            }
        ];
    }

    async execute(interaction) {
        await interaction.reply('A reply');
    }
}
```
in that file.

Change [Your Command Name] to a command name 
ex: `ping` 

Change [Your Command Description] to your command's description
ex: `A simple command`

Array `options` can be empty, but cannot be undefined. 
Option's types are 

`User` , `Boolean` , `Integer` , `Float` , `String` , `Channel` , `Role` , `Mentionable`

---

In execute function
You process things with interaction
and reply

If you finished making tihs file
Goto modules/moduleList.js , import your file on the top , and add your module to MyModules
ex : 
```javascript

import Ping from "./ping";

let MyModules = [
    new Ping()
]
```

# Adding Pinned Replys
Note! : `This Pinned Replys don't have slash(/) in front of the message`

Goto modules/pinned_replys.json
And add your Pinned Coomand and Pinned Reply
ex :
```json
{
  "Happy":"Birthday",
  "Be":"Happy"
}
```

# Run
```sh
cd /path/to/this/repo
npm start
```

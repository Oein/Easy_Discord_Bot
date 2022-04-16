# AddCommandGuid

This error occurs when a command module file isn't vaild.

# Sample File
```js
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client , Interaction } from "discord.js";

export default {
    slashBuilder: new SlashCommandBuilder()
        .setName("sample") // Name have to be lowercase
        .setDescription("Sample command")
    ,
    needIntents: ["GUILDS"],
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    run : async (client, interaction) => {
        if (!interaction.isCommand()) {
            console.log("Not command");
            return;
        }

        // Your Code Here
    }
}
```

# Warns
1. A command file must have default in export like `export default`
2. Default Export Must have `slashBuilder : SlashCommandBuilder` , `needIntents : array<string>` , `run : function`
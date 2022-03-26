import { Client , Intents } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { existsSync , readFileSync } from "fs";
import moduleList from "../modules/moduleList";
import PinRep from "./../modules/pinned_replys.json";

let token = "";
let token_file = "bot.token";
let commandJson = {};

if(existsSync(token_file)){
    token = readFileSync(token_file).toString();
}
else{
    console.warn("No token found");
    console.log("Please create a file called 'bot.token' with your token in it");
    process.exit(1);
}

let client = new Client({ intents: [Intents.FLAGS.GUILDS , Intents.FLAGS.GUILD_MESSAGES , Intents.FLAGS.DIRECT_MESSAGES] });

client.once('ready', (info) => {
    info.user.setActivity("Doing something that I can do");
    console.log("---------- Bot Info ----------");
	console.log("Bot Name \t: " , info.user.username);
    console.log("Bot ID \t\t: " , info.user.id);
    console.log("Bot Tag \t: " , info.user.tag);
    console.log("Bot Avatar \t: " , info.user.avatar);
    console.log("Bot Status \t: " , info.user.presence.status);
    console.log("Bot Game \t: " , info.user.presence.activities[0].name);
    console.log("------------------------------");

    let temp_ = [];

    moduleList.forEach(module => {
        let module_ = new SlashCommandBuilder();
        module.name = module.name.toLowerCase();
        module_.setName(module.name);
        module_.setDescription(module.description);
        temp_.push(module_);
        commandJson[module.name.toLocaleLowerCase()] = module;
    });

    const commands = temp_.map(command => command.toJSON());
    
    const rest = new REST({ version: '10' }).setToken(token);
    
    if(info.guilds != undefined){
        info.guilds.cache.map(guild => {
            console.log("[Slash Adder] Adding commands to guild " + guild.id);
            rest.put(Routes.applicationGuildCommands(info.user.id , guild.id), { body: commands })
                .then(() => {})
                .catch(console.error);
        });

        console.log('[Slash Adder] Successfully registered application commands.');
    }
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return false; 
    
    console.log(`Message from ${message.author.username}: ${message.content}`);
    if(PinRep[message.content] != undefined){
        message.reply(PinRep[message.content]);
    }
});  

client.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) {
        console.log("Not command");
        return;
    }

    let command = interaction.commandName;
	if(commandJson[command.toLocaleLowerCase()] == undefined){
        interaction.reply("Command not found");
        return;
    }
    else{
        let module = commandJson[command.toLocaleLowerCase()];
        module.execute(interaction);
    }
});

client.login(token);

//https://discord.com/oauth2/authorize?client_id=956844556819759144&permissions=328798907398&scope=bot%20applications.commands
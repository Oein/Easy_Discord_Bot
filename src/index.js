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
    console.log("---------- Bot Info ----------");
	console.log("Bot Name \t: " , info.user.username);
    console.log("Bot ID \t\t: " , info.user.id);
    console.log("Bot Tag \t: " , info.user.tag);
    console.log("Bot Avatar \t: " , info.user.avatar);
    console.log("Bot Status \t: " , info.user.presence.status);
    console.log("------------------------------");

    let temp_ = [];

    moduleList.forEach(module => {
        let module_ = new SlashCommandBuilder();
        module.name = module.name.toLowerCase();
        module_.setName(module.name);
        module_.setDescription(module.description);
        module.options.forEach(ot => {
            let opts_g  = ["user" , "boolean" , "integer" , "float" , "string" , "channel" , "role" , "mentionable"];
            let retFunc = (optx) => {
                optx.setName(ot.name);
                optx.setDescription(ot.description);
                optx.setRequired(ot.required);
                return optx;
            }

	    let ott = ot.type.toLocaleLowerCase();
            
            if(opts_g[0] == ott){
                module_.addUserOption(retFunc);
            }
            else if(opts_g[1] == ott){
                module_.addBooleanOption(retFunc);
            }
            else if(opts_g[2] == ott){
                module_.addIntegerOption(retFunc);
            }
            else if(opts_g[3] == ott){
                module_.addFloatOption(retFunc);
            }
            else if(opts_g[4] == ott){
                module_.addStringOption(retFunc);
            }
            else if(opts_g[5] == ott){
                module_.addChannelOption(retFunc);
            }
            else if(opts_g[6] == ott){
                module_.addRoleOption(retFunc);
            }
            else if(opts_g[7] == ott){
                module_.addMentionableOption(retFunc);
            }
            else{
                throw new Error("Invalid option type " + ot.type);
            }
        });
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

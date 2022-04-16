import { existsSync , readdirSync } from "fs";
import { Client } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { basename } from "path";
import { cnerror } from "./errorMessage";

let rootPath = __dirname + "/../";
let SettingsFolderPath = rootPath + "EDB_Settings/";
let CommandsFolderPath = rootPath + "EDB_Commands/";
let settingsFilePath = SettingsFolderPath + "settings.json";
let sampleCommandFileName = "Command.Sample.js";

if(!existsSync(SettingsFolderPath)){
    cnerror("SettingsFolderPathGuid");
}

if(!existsSync(settingsFilePath)){
    cnerror("SettingsFileGuid");
}

let configFile = require("./../EDB_Settings/settings.json");

if(!existsSync(CommandsFolderPath)){
    cnerror("CommandsFolderGuid");
}

let commandFiles = readdirSync(CommandsFolderPath).filter(file => file.endsWith(".js"));

// add all intents to needIntents

let NI = [];
let commandJson = {};

for(let commandFile of commandFiles){
    if(commandFile == sampleCommandFileName) continue;
    let commandModulePath = "./../EDB_Commands/" + basename(commandFile).replace(".js", "");
    let commandModule = require(commandModulePath).default;
    let intents = commandModule.needIntents;
    for(let intent of intents){
        if(!NI.includes(intent)) NI.push(intent);
    }
    commandJson[commandModule.slashBuilder.name] = commandModule;
}

let client = new Client({
    intents: NI
});

// event handlers
client.on("ready" , (info) => {
    console.log("---------- Bot Info ----------");
	console.log("Bot Name \t: " , info.user.username);
    console.log("Bot ID \t\t: " , info.user.id);
    console.log("Bot Tag \t: " , info.user.tag);
    console.log("Bot Avatar \t: " , info.user.avatar);
    console.log("Bot Status \t: " , info.user.presence.status);
    console.log("Bot Intents \t: " , NI.join(" , "));
    console.log("------------------------------");

    let slBuilders = [];

    for(let commandFile of commandFiles){
        if(commandFile == sampleCommandFileName) continue;
        let commandModule = require(CommandsFolderPath + commandFile).default;
        
        let slBuilder = commandModule.slashBuilder;
        commandJson[slBuilder.name] = commandModule;
        slBuilders.push(slBuilder);
    }

    let slashCommands = slBuilders.map(command => command.toJSON());
    let rest = new REST({ version: '10' }).setToken(configFile.Token);

    if(info.guilds != undefined){
        info.guilds.cache.map(guild => {
            console.log("[Slash Adder] Adding commands to guild " + guild.id);
            rest.put(Routes.applicationGuildCommands(info.user.id , guild.id), { body: slashCommands })
                .then(() => {})
                .catch(console.error);
        });
        console.log('[Slash Adder] Successfully registered application ' + slashCommands.length + ' commands to ' + info.guilds.cache.size + ' guilds.');
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
        module.run(client , interaction);
    }
});

if(configFile.Token == undefined || configFile.Token == null){
    cnerror("TokenNotFound");
}

// login
client.login(configFile.Token);
import { existsSync , readdirSync } from "fs";
import { Client , version } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes , GatewayVersion } from "discord-api-types/v10";
import { basename } from "path";
import { cnerror , onerror } from "./errorMessage";

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

let bot_id = "";
let slashCommands;
let rest;

for(let commandFile of commandFiles){
    if(commandFile == sampleCommandFileName) continue;
    let commandModulePath = "./../EDB_Commands/" + basename(commandFile).replace(".js", "");
    let commandModuleFull = require(commandModulePath);
    if(commandModuleFull.default == undefined || commandModuleFull.default == null){
        continue;
    }
    let commandModule = commandModuleFull.default;

    if(commandModule.needIntents == undefined || commandModule.needIntents == null){
        continue;
    }

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
    console.log("---------- EDB Info ----------");
    console.log("Author \t\t: Oein");
    console.log("Version \t: 2.0.0B");
    console.log("Github \t\t: https://github.com/Oein/Easy_Discord_Bot");
    console.log("Discord.js \t: " + version);
    console.log("Discord Api\t: " + GatewayVersion);
    console.log("---------- Bot Info ----------");
	console.log("Bot Name \t: " , info.user.username);
    console.log("Bot ID \t\t: " , info.user.id);
    console.log("Bot Tag \t: " , info.user.tag);
    console.log("Bot Avatar \t: " , info.user.avatar);
    console.log("Bot Status \t: " , info.user.presence.status);
    console.log("Bot Intents \t: " , NI.join(" , "));
    console.log("------------------------------");

    let slBuilders = [];

    let failedCommand = 0;
    let findedCommand = 0;

    for(let commandFile of commandFiles){
        if(commandFile == sampleCommandFileName) continue;
        findedCommand++;
        let commandModulePath = "./../EDB_Commands/" + basename(commandFile).replace(".js", "");
        let commandModuleFull = require(commandModulePath);
        if(commandModuleFull.default == undefined || commandModuleFull.default == null){
            onerror("CommandDefaultGuid" , "EDB_Commands/" + commandFile);
            failedCommand++;
            continue;
        }
        let commandModule = commandModuleFull.default;

        if(commandModule.needIntents == undefined || commandModule.needIntents == null){
            onerror("CommandIntentsGuid" , "EDB_Commands/" + commandFile);
            failedCommand++;
            continue;
        }

        if(commandModule.slashBuilder == undefined || commandModule.slashBuilder == null){
            onerror("CommandSlashBuilderGuid" , "EDB_Commands/" + commandFile);
            failedCommand++;
            continue;
        }

        if(commandModule.run == undefined || commandModule.run == null){
            onerror("CommandRunGuid" , "EDB_Commands/" + commandFile);
            failedCommand++;
            continue;
        }
        
        let slBuilder = commandModule.slashBuilder;
        commandJson[slBuilder.name] = commandModule;
        slBuilders.push(slBuilder);
    }

    slashCommands = slBuilders.map(command => command.toJSON());
    rest = new REST({ version: '10' }).setToken(configFile.Token);

    bot_id = info.user.id;

    if(info.guilds != undefined){
        info.guilds.cache.map(guild => {
            console.log("[Slash Adder] Adding commands to guild " + guild.id);
            rest.put(Routes.applicationGuildCommands(info.user.id , guild.id), { body: slashCommands })
                .then(() => {})
                .catch((err) => {
                    console.warn("Error while adding commands to guild " + guild.id);
                });
        });
        console.log('[Slash Adder] Successfully registered application ' + (findedCommand - failedCommand).toString() + "/" + findedCommand.toString() + ' commands to ' + info.guilds.cache.size + ' guilds.');
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

client.on("guildCreate" , guild => {
    rest.put(Routes.applicationGuildCommands(bot_id , guild.id), { body: slashCommands })
        .then(() => {})
        .catch(console.error);
});

if(configFile.Token == undefined || configFile.Token == null){
    cnerror("TokenNotFound");
}

// login
client.login(configFile.Token);
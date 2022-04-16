import { SlashCommandBuilder } from "@discordjs/builders";
import { Client , Interaction } from "discord.js";

export default {
    slashBuilder: new SlashCommandBuilder()
        .setName("sample") // Name have to be lowercase
        .setDescription("Sample command")
        .addRoleOption(option => {
            option
                .setName("role_option") // Name have to be lowercase
                .setDescription("Sample role option");
            return option;
        })
        .addUserOption(option => {
            option
                .setName("user_option") // Name have to be lowercase
                .setDescription("Sample user option");
            return option;
        })
        .addNumberOption(option => {
            option
                .setName("number_option") // Name have to be lowercase
                .setDescription("Sample number option");
            return option;
        })
        .addStringOption(option => {
            option
                .setName("string_option") // Name have to be lowercase
                .setDescription("Sample string option");
            return option;
        })
        .addBooleanOption(option => {
            option
                .setName("boolean_option") // Name have to be lowercase
                .setDescription("Sample boolean option");
            return option;
        })
        .addChannelOption(option => {
            option
                .setName("channel_option") // Name have to be lowercase
                .setDescription("Sample channel option");
            return option;
        })
        .addIntegerOption(option => {
            option
                .setName("integer_option") // Name have to be lowercase
                .setDescription("Sample integer option");
            return option;
        })
        .addMentionableOption(option => {
            option
                .setName("mentionable_option") // Name have to be lowercase
                .setDescription("Sample mentionable option");
            return option;
        })
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

        // reply message
        interaction.reply("You sent me sample command!");

        // get every options
        let options = interaction.options._hoistedOptions;

        let optionString = ".\n";

        for(let option of options){
            optionString += option.name + " : " + option.value + "\n";
        }
        
        // direct message
        interaction.member.send(optionString);

        // get a specific option
        let roleOption = interaction.options.get("role_option");

        if(roleOption != undefined){ // you have to check the option is exist
            interaction.member.send("a role option sent : " + roleOption.value);
        }
    }
}
export default class Ping {
    constructor() {
        this.name = 'ping'; // Name only supports lowercase
        this.description = 'A simple ping command';
    }

    async execute(interaction) {
        await interaction.reply('Pong!');
    }
}
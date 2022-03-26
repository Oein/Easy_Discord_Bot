export default class Ping {
    constructor() {
        this.name = 'ping'; // Name only supports lowercase
        this.description = 'A simple ping command';
        this.options = [
            {
                name: 'pingopt',
                description: 'A ping option',
                required: true,
                type: 'String'
            },
            {
                name: 'pongoption2',
                description: 'A pong option',
                required: false,
                type: 'Boolean'
            }
        ];
    }

    async execute(interaction) {
        await interaction.reply(interaction.options.get("pingopt").value + " " + interaction.options.get("pongoption2").value + ' Pong!');
    }
}
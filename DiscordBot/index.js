require('dotenv').config();
const {Client, Events, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Permissions} = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})

client.on(Events.ClientReady, (x) => {
    console.log(`${x.user.tag} is ready!`);

    const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('This is a ping command!');

    const hello = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('This is a hello command!')
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('The user to say hi to')
        .setRequired(false)
        )

    const add = new SlashCommandBuilder()
        .setName('add')
        .setDescription('This adds two numbers')
        .addNumberOption(option =>
            option
            .setName('first_number')
            .setDescription('The frist number')
            .setRequired(true)
        )
        .addNumberOption(option =>
            option
            .setName('second_number')
            .setDescription('The second number')
            .setRequired(true)
        )

    client.application.commands.create(ping);
    client.application.commands.create(hello);
    client.application.commands.create(add);
});

client.on('interactionCreate', (interaction => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'ping') {
        interaction.reply(`🏓 Pong!`)
    }
    if(interaction.commandName === 'hello') {
        const userOption = interaction.options.getUser('user');
        if (userOption) {
            interaction.reply(`Hello, ${userOption.toString()}!`)
        } else {
            interaction.reply('Hello!')  
        }
    } 
    if(interaction.commandName === 'add') {
        const first_number = interaction.options.getNumber('first_number');
        const second_number = interaction.options.getNumber('second_number');

        if(isNaN(first_number) || isNaN(second_number)) {
            interaction.reply('Please enter a valid numeber(s)')
        } else {
            const result = first_number + second_number;
            interaction.reply(`Your result is ${result}.`)
        }
    }
}))

client.login(process.env.TOKEN);
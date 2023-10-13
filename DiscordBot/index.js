import dotenv from 'dotenv';
dotenv.config();

import {
    Client,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
} from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

import { addTrackedFeature } from './commands/feature.js';


client.on(Events.ClientReady, (x) => {
    console.log(`${x.user.tag} is ready!`);

    const feature = new SlashCommandBuilder()
        .setName('feature')
        .setDescription('This creates a trackable feature request');

    client.application.commands.create(feature);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'feature') {
        addTrackedFeature(interaction);
    }
});

client.login(process.env.TOKEN);
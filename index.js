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

// import { addTrackedFeature } from './src/commands/feature.js';
import { addTrackedBug } from './src/commands/bug.js';
// import { addTrackedImprovement } from './src/commands/improvement.js';
import { approvedRequestReport } from './src/commands/approved.js';
import { declinedRequestReport } from './src/commands/declined.js';
import { completedRequestReport } from './src/commands/completed.js';


client.on(Events.ClientReady, (x) => {
    console.log(`${x.user.tag} is ready!`);

    const bug = new SlashCommandBuilder()
        .setName('bug')
        .setDescription('This creates a trackable bug report and renames the thread\'s title')
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('The description of the bug report')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('reporter')
                .setDescription('Who submitted the report')
                .setRequired(true))
        .addStringOption(option =>
            option
            .setName('attachments')
            .setDescription('Links to relevant attachments, seperate with spaces'));

   
    client.application.commands.create(bug);

});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.member;
    
    if (interaction.commandName === 'feature' && member.roles.cache.some(role => role.name === 'Developer')) {
        addTrackedFeature(interaction, client);
    }

    if (interaction.commandName === 'bug' && member.roles.cache.some(role => role.name === 'Developer')) {
        addTrackedBug(interaction, client);
    }

    if (interaction.commandName === 'improvement' && member.roles.cache.some(role => role.name === 'Developer')) {
        addTrackedImprovement(interaction, client);
    }

    if (interaction.commandName === 'declined' && member.roles.cache.some(role => role.name === 'Admin')) {
        declinedRequestReport(interaction, client);
    }

    if (interaction.commandName === 'approved' && member.roles.cache.some(role => role.name === 'Admin')) {
        approvedRequestReport(interaction, client);
    }

    if (interaction.commandName === 'completed' && member.roles.cache.some(role => role.name === 'Developer')) {
        completedRequestReport(interaction, client);
    }
});

client.login(process.env.TOKEN);
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
import { approveRequestReport } from './src/commands/approve.js';
import { declineRequestReport } from './src/commands/decline.js';
import { indicateDevelopment } from './src/commands/in-development.js'
//import { completedRequestReport } from './src/commands/completed.js';


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

    const approve = new SlashCommandBuilder()
        .setName('approve')
        .setDescription('This approves a feature or imporvement request (Use /verified for bug reports)')
        .addUserOption(option =>
            option
                .setName('requester')
                .setDescription('Who originally submitted the request')
                .setRequired(true));

    const decline = new SlashCommandBuilder()
        .setName('decline')
        .setDescription('This declines a feature or improvement request (Use /unverifiable for bug reports')
        .addUserOption(option =>
            option
                .setName('requester')
                .setDescription('Who originally submitted the request')
                .setRequired(true));

    const verified = new SlashCommandBuilder()
        .setName('verified')
        .setDescription('This indicates that the bug report has been verfied')
        .addUserOption(option =>
            option
                .setName('reporter')
                .setDescription('Who originally submitted the report')
                .setRequired(true));

    const unverifiable = new SlashCommandBuilder()
        .setName('unverifiable')
        .setDescription('This indicates that the bug report was not able to be verfied')
        .addUserOption(option =>
            option
                .setName('reporter')
                .setDescription('Who originallt submitted the report')
                .setRequired(true));

    const inDevelopment = new SlashCommandBuilder()
        .setName('in-development')
        .setDescription('This indicates that the request or report is in development')
        .addUserOption(option =>
            option
                .setName('reporter')
                .setDescription('who originally submitted the request or report')
                .setRequired(true));


    const completed = new SlashCommandBuilder()
        .setName('completed')
        .setDescription('This announces the completion of a featrue or improvement request or a bug report')
        .addUserOption(option =>
            option
                .setName('reporter')
                .setDescription('Who originally submitted the request or report'));

   
    client.application.commands.create(bug);
    client.application.commands.create(approve);
    client.application.commands.create(decline);
    client.application.commands.create(verified);
    client.application.commands.create(unverifiable);
    client.application.commands.create(inDevelopment);
    client.application.commands.create(completed);

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

    if (interaction.commandName === 'decline' && member.roles.cache.some(role => role.name === 'Admin')) {
        declineRequestReport(interaction);
    }

    if (interaction.commandName === 'approve' && member.roles.cache.some(role => role.name === 'Admin')) {
        approveRequestReport(interaction);
    }

    if (interaction.commandName === 'verified' && member.roles.cache.some(role => role.name === 'Developer')) {
        approveRequestReport(interaction, client);
    }

    if (interaction.commandName === 'unverifiable' && member.roles.cache.some(role => role.name === 'Admin')) {
        approveRequestReport(interaction, client);
    }

    if (interaction.commandName === 'in-development' && member.roles.cache.some(role => role.name === 'Developer')) {
        indicateDevelopment(interaction);
    }

    if (interaction.commandName === 'completed' && member.roles.cache.some(role => role.name === 'Developer')) {
        completedRequestReport(interaction, client);
    }
});

client.login(process.env.TOKEN);
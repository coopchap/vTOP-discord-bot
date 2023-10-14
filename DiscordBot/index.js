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
import { addTrackedBug } from './commands/bug.js';
import { addTrackedImprovement } from './commands/improvement.js';
import { approvedRequestReport } from './commands/approved.js';
import { declinedRequestReport } from './commands/declined.js';
import { finishedRequestReport } from './commands/finished.js';


client.on(Events.ClientReady, (x) => {
    console.log(`${x.user.tag} is ready!`);

    const feature = new SlashCommandBuilder()
        .setName('feature')
        .setDescription('This creates a trackable feature request and renames the thread\'s title')
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('The description of the feature request'));

    const bug = new SlashCommandBuilder()
        .setName('bug')
        .setDescription('This creates a trackable bug report and renames the thread\'s title')
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('The description of the bug report'))
        .addStringOption(option =>
            option
            .setName('attachements')
            .setDescription('Links to relevant attachements'));

    const improvement = new SlashCommandBuilder()
        .setName('improvement')
        .setDescription('This creates a trackable improvement request and renames the thread\'s title')
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('The description of the bug report'))
        .addStringOption(option =>
            option
            .setName('attachements')
            .setDescription('Links to relevant attachements'));

    const declined = new SlashCommandBuilder()
        .setName('declined')
        .setDescription('This declines the request/report in the current thread')
        .addStringOption(option =>
            option
            .setname('reason')
            .setDescription('The reason for declination'));

    const approved = new SlashCommandBuilder()
        .setName('approved')
        .setDescription('This approves the request/report in the current thread, meaning development on it will start')

    const finished = new SlashCommandBuilder()
        .setName('finished')
        .setDescription('This closes the thread and notifies the requester/reporter that the development is live.')
        .addStringOption(option =>
            option
                .setName('additional info')
                .setDescription('Additional information')); 

    client.application.commands.create(feature);
    client.application.commands.create(bug);
    client.application.commands.create(improvement);
    client.application.commands.create(declined);
    client.application.commands.create(approved);
    client.application.commands.create(finished);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'feature' && member.roles.cache.some(role => role.name === 'Developer')) {
        addTrackedFeature(interaction);
    }

    if (interaction.commandName === 'bug' && member.roles.cache.some(role => role.name === 'Developer')) {
        addTrackedBug(interaction);
    }

    if (interaction.commandName === 'improvement' && member.roles.cache.some(role => role.name === 'Developer')) {
        addTrackedImprovement(interaction);
    }

    if (interaction.commandName === 'declined' && member.roles.cache.some(role => role.name === 'Admin')) {
        declinedRequestReport(interaction);
    }

    if (interaction.commandName === 'approved' && member.roles.cache.some(role => role.name === 'Admin')) {
        approvedRequestReport(interaction);
    }

    if (interaction.commandName === 'finished' && member.roles.cache.some(role => role.name === 'Developer')) {
        finishedRequestReport(interaction);
    }
});

client.login(process.env.TOKEN);
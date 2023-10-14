import {
    Client,
    GatewayIntentBits
} from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

import { read, writeFileXLSX } from "xlsx";

export function addTrackedBug(interaction) {
    const bugID = getNextBugID(interaction);
    addBugToExcel(interaction, bugID);
    renameThread(interaction, bugID);
    reply(interaction, bugID);
}

function getNextBugID(interaction) {

        let latestIDJson = require('../../tracking/latestID.json');
        const parsedJSON = JSON.parse(latestIDJson);
        const latestBugID = parsedJSON.bugID;

        const IDLength = latestBugID.toString().length;
        let viewBugID;
    try {
        switch (IDLength) {
            case 1:
                viewBugID = "00" + latestBugID;
                break;

            case 2:
                viewBugID = "0" + latestBugID;
                break;

            case 3:
                viewBugID = latestBugID;
                break;

            default:
                interaction.reply({ content: 'There was an error tracking the bug report: \'latestBugID\' was too long or not valid', ephemeral: true });
                throw new Error('\'latestBugID\' was too long or not valid');
        }
    } catch (error) {
        console.error(error);
    }

    parsedJSON.bugID = bugID++;

    if (bugID >= 900) {
        interaction.reply({ content: 'Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000', ephemeral: true });
        console.warn('Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000');
    }

    return viewBugID;
}


function addBugToExcel(interaction) {
    const workbook = xlsx.readFile('../../tracking/book.xlsx')
    let worksheet = workbook.Sheets['Sheet1'];
    // let cellData = worksheet['A1'].v;
    // interaction.reply(cellData);
    const channelId = interaction.channelId;
    const thread = client.channels.cache.get(channelId);
    const bugName = thread.name;
}

function renameThread(interaction) {
    const channelID = interaction.channelId;
    const thread = client.channels.cache.get(channelID);
    let threadName = thread.name;
    thread.name = '[vCGP-B' + bugID + '] ' + threadName;
}

function reply(interaction, bugID) {
    const reporter = interaction.getUser('reporter');
    interaction.reply('@' + reporter.username + ', your feature request is now being tracked. vCGP Admins will discuss if this feature should implemented. If a consensus is reached, I\'ll notify you in this thread.')
}
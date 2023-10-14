import {
    Client,
    GatewayIntentBits
} from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

export function addTrackedBug(interaction) {
    const bugIDs = getNextBugID(interaction);
    const viewBugID = bugIDs[0];
    const bugID = bugIDs[1]
    addBugToExcel(interaction, bugID, viewBugID);
    renameThread(interaction, viewBugID);
    reply(interaction, viewBugID);
}

function getNextBugID(interaction) {

        let lastIDJson = require('../../tracking/lastID.json');
        const parsedJSON = JSON.parse(lastIDJson);
        const lastBugID = parsedJSON.bugID;
        let currentBugID = lastBugID++;

        const IDLength = lastBugID.toString().length;
        let viewBugID;
    try {
        switch (IDLength) {
            case 1:
                viewBugID = "00" + currentBugID;
                break;

            case 2:
                viewBugID = "0" + currentBugID;
                break;

            case 3:
                viewBugID = currentBugID;
                break;

            default:
                interaction.reply({ content: 'There was an error tracking the bug report: \'latestBugID\' was too long or not valid', ephemeral: true });
                throw new Error('\'latestBugID\' was too long or not valid');
        }
    } catch (error) {
        console.error(error);
    }

    parsedJSON.bugID = currentBugID;

    if (bugID >= 900) {
        interaction.reply({ content: 'Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000', ephemeral: true });
        console.warn('Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000');
    }

    const returnValues = [viewBugID, currentBugID];
    return returnValues;
}


function addBugToExcel(interaction, bugID, viewBugID) {
    var XLSX = require("xlsx");
    const workbook = XLSX.readFile('../../tracking/book.xlsx')
    let worksheet = workbook.Sheets['Sheet1'];
    
    const channelId = interaction.channelId;
    const thread = client.channels.cache.get(channelId);
    const bugName = thread.name;
    const bugDescription = interaction.getString('description');
    const bugAttachments = interaction.getString('attachements');
    const bugCreationDate = interaction.createdAt;

    const rowNumber = bugID + 3;
    function updateCell(column, text) {
        worksheet[XLSX.utils.encode_cell({r: rowNumber, c: column})].v = text;
    }

    updateCell(10, viewBugID);
    updateCell(11, bugName);
    updateCell(12, bugDescription);
    updateCell(13, bugAttachments);
    updateCell(14, bugCreationDate);
    updateCell(15, "Reviewing");
    updateCell(16, "-");
    updateCell(17, "-");
}

function renameThread(interaction, viewBugID) {
    const channelID = interaction.channelId;
    const thread = client.channels.cache.get(channelID);
    let threadName = thread.name;
    thread.name = '[vCGP-B' + viewBugID + '] ' + threadName;
}

function reply(interaction, bugID) {
    const reporter = interaction.getUser('reporter');
    interaction.reply('@' + reporter.username + ', your feature request is now being tracked. vCGP Admins will discuss if this feature should implemented. If a consensus is reached, I\'ll notify you in this thread.')
}
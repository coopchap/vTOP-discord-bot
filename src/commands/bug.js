import {
    Client,
    GatewayIntentBits
} from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

export function addTrackedBug(interaction) {
    const bugIDs = getNextBugID(interaction); //gets id for this bug and formatted veresion
    const viewBugID = bugIDs[0]; //seperates getNextBugID into seperate variables
    const bugID = bugIDs[1]
    console.log('we made it this far');
    reply(interaction, viewBugID); //provides message in thread
    renameThread(interaction, viewBugID); //renames thread with id
    addBugToExcel(interaction, bugID, viewBugID); //adds bug to .xlsx
    console.log('now we are here');
}

function getNextBugID(interaction) {

    /* const fs = require('fs');  -- Commented out since this isn't valid to be run in browser

    let currentBugID;
    
    fs.promises.readFile('../../tracking/lastID.json', 'utf8')
      .then(data => {
        const jsonData = JSON.parse(data);
        const lastBugID = jsonData.bugID;
        currentBugID = lastBugID + 1;
      })
      .catch(error => {
        console.error('Error:', error);
      });

        const IDLength = currentBugID.toString().length;
        let viewBugID;
    try {
        switch (IDLength) { //adds appropriate number of 0s to get three digit number
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

    if (currentBugID >= 900) { //warns if close to 1000 (4 digit ids not supported)
        interaction.reply({ content: 'Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000', ephemeral: true });
        console.warn('Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000');
    } 

    const returnValues = [viewBugID, currentBugID];  */
    const returnValues = ["001", 1]
    return returnValues; //returns formatted and non-formatted id
}


function addBugToExcel(interaction, bugID, viewBugID) {
    var XLSX = require("xlsx");   //load .xlsx sheet vvvv
    const workbook = XLSX.readFile('../../tracking/book.xlsx')
    let worksheet = workbook.Sheets['Sheet1'];  
    
    const channelId = interaction.channelId; // prepares data for cells vvvv
    const thread = client.channels.cache.get(channelId);
    const bugName = thread.name;
    const bugDescription = interaction.getString('description');
    const bugAttachments = interaction.getString('attachements');
    const bugCreationDate = interaction.createdAt;

    const rowNumber = bugID + 3; //accounts for headers taking up rows
    function updateCell(column, text) {
        worksheet[XLSX.utils.encode_cell({r: rowNumber, c: column})].v = text; //gets cell address based on calcuolated row and submitted colum, sets text to there
    }

    updateCell(10, viewBugID); //inputs all the text vvvv
    updateCell(11, bugName);
    updateCell(12, bugDescription);
    updateCell(13, bugAttachments);
    updateCell(14, bugCreationDate);
    updateCell(15, "Reviewing");
    updateCell(16, "-");
    updateCell(17, "-");
}

function renameThread(interaction, viewBugID) {
    console.log('renamed');
    const channelID = interaction.channelId;  //gets thread name vvvv
    const thread = client.channels.cache.get(channelID);
    let threadName = thread.name;
    thread.name = '[vCGP-B' + viewBugID + '] ' + threadName; //updates name
}

function reply(interaction, bugID) { //adds message about feature now being tracked
    console.log('replied');
    interaction.reply('@, your feature request is now being tracked. vCGP Admins will discuss if this feature should implemented. If a consensus is reached, I\'ll notify you in this thread.')
}
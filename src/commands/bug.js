import {
    Client,
    GatewayIntentBits,
    GuildExplicitContentFilter
} from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

export async function addTrackedBug(interaction) {
    const bugID = getNextBugID(interaction); //gets current bug id, ex: '1'
    const viewBugID = formatBugID(bugID, interaction)[0]; //ex: 'vCGP-B001'
    const excelBugID = formatBugID(bugID, interaction)[1]; //ex: '001'

    await addBugToExcel(interaction, bugID, excelBugID); //adds bug to .xlsx 
    const threadNames = await getNewThreadName(interaction, viewBugID);
    const newThreadName = threadNames[0];
    const bugTitle = threadNames[1];
    await reply(interaction, viewBugID, bugTitle, client) //provides message in thread
    renameThread(interaction, newThreadName); //renames thread with id, gets threadaa title`
}

function getNextBugID(interaction) {

    /* const fs = require('fs'); 

    let currentBugID;
    fs.promises.readFile('../../tracking/lastID.json', 'utf8')
      .then(data => {
        const jsonData = JSON.parse(data);
        const lastBugID = jsonData.bugID;
        currentBugID = lastBugID + 1;
      })
      .catch(error => {
        console.error('Error: unable to read lastID.json', error);
      });

    if (currentBugID >= 900) { //warns if close to 1000 (4 digit ids not supported)
        interaction.reply({ content: 'Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000', ephemeral: true });
        console.warn('Warning: \'latestBugID\' is approaching 1000, consider updating code to accomadate for IDs greater than 1000');
    } 

    return currentBugID;
    */
    return 68; //temporary, cant be run in browser
}

function formatBugID(bugID, interaction) {
    const IDLength = bugID.toString().length;
    let threeDigitBugID;
    try {
        switch (IDLength) { //adds appropriate number of 0s to get three digit number
            case 1:
                threeDigitBugID = "00" + bugID;
                break;

            case 2:
                threeDigitBugID = "0" + bugID;
                break;

            case 3:
                threeDigitBugID = bugID;
                break;

            default:
                throw new Error('\'bugID\' was too long or not valid');
        }
    const viewBugID = 'vCGP-B' + threeDigitBugID;
    return [viewBugID, threeDigitBugID];

    } catch (error) {
        console.error(error);
    } 
}


function addBugToExcel(interaction, bugID, viewBugID) {
    /* var XLSX = require("xlsx");   //load .xlsx sheet vvvv
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
    updateCell(17, "-"); */
}

function getNewThreadName(interaction, viewBugID) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const newThreadName = "[" + viewBugID + "] " + forumPostName; 
    return [newThreadName, forumPostName];
}

function renameThread(interaction, newThreadName) {
    const forumPost = interaction.channel;
    forumPost.setName(newThreadName);
}

async function reply(interaction, viewBugID, bugTitle, client) { //adds message about feature now being tracked
    const reporter = interaction.options.getUser('reporter'); //get user selected when cmommand sent
    interaction.reply(`${reporter}, your bug report is now being tracked! A ticket is has been filed. You will be notified in this thread if the issue is resolved.\nYour ticket number is: **${viewBugID}**`);

    const bugDescription = interaction.options.getString('description');
    const attatchmentsNumber = 0;
    const bugCreationStamp = interaction.createdTimestamp;
    const correctedStamp = bugCreationStamp.toString().slice(0, 10);
    console.log(correctedStamp);
    const bugCreationDate = `<t:${correctedStamp}:d>`;


    interaction.user.send(`You have created a new bug ticket in the vCGP server.\nID: \`${viewBugID}\`.\nTitle: \`${bugTitle}\`.\nDescription: \`${bugDescription}\`.\nAttatchments: \`${attatchmentsNumber}\`.\nCreated: ${bugCreationDate}\n\nIf this was a mistake, contact an admin`);
}
import { fetchTitlePrefix } from "../common.js";

export async function declineRequestReport(interaction) {
    try {
        if (verifyRequeseted(interaction) === 'true') { 
            await reply(interaction);
            await closeThread(interaction);
            renameThread(interaction);
            // updateStatusInExcel();
        } else if (verifyRequeseted(interaction) === 'bug') {
            interaction.reply({content: 'Error: Cannot decline a bug report. Use /unverifiable instead.', ephemeral: true})
        } else {
            interaction.reply({content: 'Error: I was not able to validate whether this post is being tracked or not.', ephemeral: true});
        }
    } catch (error) {
        console.error(error);
    }
}

function verifyRequeseted(interaction) {
    const titlePrefix = fetchTitlePrefix(interaction, 7);
    if (titlePrefix === '[vTOP-F' || titlePrefix === '[vTOP-I') {
        return 'true';
    } else if (titlePrefix === '[vTOP-B') {
        return 'bug';
    }
}

function renameThread(interaction) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const newPostName = "❌ " + forumPostName;
    forumPost.setName(newPostName);
}

function reply(interaction) {
    const requester = interaction.options.getUser('requester');
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const titlePrefix = forumPostName.slice(0, 7);
    let type;
    if (titlePrefix === "[vTOP-F") {
        type = 'feature ';
    } else if (titlePrefix === "[vTOP-I") {
        type = 'improvement ';
    }
    interaction.reply(`${requester}, I am sorry to report that vTOP admins have decided to not continue with your ${type}request.\nI am now going to close this thread.`);
}

function closeThread(interaction) {
    const forumPost = interaction.channel;
    forumPost.setLocked(true);
}

function updateStatusInExcel() {
    // needs code
}
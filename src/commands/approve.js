import { 
    ChannelManager, 
    channelMention
} from "discord.js";

import { fetchTitlePrefix } from "../common.js";

export async function approveRequestReport(interaction) {
    try {
        if (verifyRequeseted(interaction) === 'true') {
            await reply(interaction);
            renameThread(interaction);
            addToAssignmentForum(interaction);
            // updateStatusInExcel();
        } else if (verifyRequeseted(interaction) === 'bug') {
            interaction.reply({content: 'Error: Cannot approve a bug report. Use /verified instead.', ephemeral: true})
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
    const newPostName = "✅ " + forumPostName;
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
    interaction.reply(`Congratulations, ${requester}, vTOP admins have decided to approve your ${type}request. I'll update you in this thread when development begins.`);
}

async function addToAssignmentForum(interaction) {
    const channelManager = await new ChannelManager(interaction.client);
    const assignmentsForum = await channelManager.fetch('1163230909395390584');

    const requestTitle = interaction.channel.name;
    const requestPost = channelMention(interaction.channelId);

    const titlePrefix = interaction.channel.name.slice(0, 7);
    let type;
    if (titlePrefix === "[vTOP-F") {
        type = 'feature ';
    } else if (titlePrefix === "[vTOP-I") {
        type = 'improvement ';
    }

    assignmentsForum.threads.create({
        name: requestTitle,
        message: {content: `${requestPost} A new ${type}request has been made. Stay tuned, vTOP admins will assign a devloper to this request soon.`},
    })
}

function updateStatusInExcel() {
    // needs code
}


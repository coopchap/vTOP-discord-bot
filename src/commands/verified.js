import { 
    ChannelManager, 
    channelMention
} from "discord.js";

import { fetchTitlePrefix } from "../common.js";
 
export async function verifiedReport(interaction) {
    try {
        if (verifyReported(interaction)) {
            await reply(interaction);
            renameThread(interaction);
            addToAssignmentForum(interaction);
            // updateStatusInExcel();
        } else {
            interaction.reply({content: 'Error: I was not able to validate whether this post is a tracked bug.', ephemeral: true});
        }
    } catch (error) {
        console.error(error);
    }
}

async function verifyReported(interaction) {
    const titlePrefix = await fetchTitlePrefix(interaction, 7);
    if (titlePrefix === '[vTOP-B') {
        return true;
    } else {
        return false
    }
}

function renameThread(interaction) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const newPostName = "🕷 " + forumPostName;
    forumPost.setName(newPostName);
}

function reply(interaction) {
    const reporter = interaction.options.getUser('reporter');
    interaction.reply(`${reporter}, vTOP developers have verified your bug report. I'll update you in this thread when development begins.`);
}

async function addToAssignmentForum(interaction) {
    const channelManager = await new ChannelManager(interaction.client);
    const assignmentsForum = await channelManager.fetch('1163230909395390584');

    const requestTitle = interaction.channel.name;
    const requestPost = channelMention(interaction.channelId);

    assignmentsForum.threads.create({
        name: requestTitle,
        message: {content: `${requestPost} A new bug report has been made. Stay tuned, vTOP admins will assign a devloper to this report soon.`},
    })
}

function updateStatusInExcel() {
    // needs code
}


import { 
    ChannelManager, 
    channelMention
} from "discord.js";

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

function verifyReported(interaction) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const titlePrefix = forumPostName.slice(0, 7);
    if (titlePrefix === '[vCGP-B') {
        return true;
    } else {
        return false
    }
}

function renameThread(interaction) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const newPostName = "🪳 " + forumPostName;
    forumPost.setName(newPostName);
}

function reply(interaction) {
    const reporter = interaction.options.getUser('reporter');
    interaction.reply(`${reporter}, vCGP developers have verified your bug report. I'll update you in this thread when development begins.`);
}

async function addToAssignmentForum(interaction) {
    const channelManager = await new ChannelManager(interaction.client);
    const assignmentsForum = await channelManager.fetch('1163230909395390584');

    const requestTitle = interaction.channel.name;
    const requestPost = channelMention(interaction.channelId);

    assignmentsForum.threads.create({
        name: requestTitle,
        message: {content: `${requestPost} A new bug report has been made. Stay tuned, vCGP admins will assign a devloper to this report soon.`},
    })
}

function updateStatusInExcel() {
    // needs code
}


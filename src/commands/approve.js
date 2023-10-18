import { 
    ChannelManager, 
    channelMention
} from "discord.js";

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
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const titlePrefix = forumPostName.slice(0, 7);
    if (titlePrefix === '[vtop-F' || titlePrefix === '[vtop-I') {
        return 'true';
    } else if (titlePrefix === '[vtop-B') {
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
    if (titlePrefix === "[vtop-F") {
        type = 'feature ';
    } else if (titlePrefix === "[vtop-I") {
        type = 'improvement ';
    }
    interaction.reply(`Congratulations, ${requester}, vtop admins have decided to approve your ${type}request. I'll update you in this thread when development begins.`);
}

async function addToAssignmentForum(interaction) {
    const channelManager = await new ChannelManager(interaction.client);
    const assignmentsForum = await channelManager.fetch('1163230909395390584');

    const requestTitle = interaction.channel.name;
    const requestPost = channelMention(interaction.channelId);

    const titlePrefix = interaction.channel.name.slice(0, 7);
    let type;
    if (titlePrefix === "[vtop-F") {
        type = 'feature ';
    } else if (titlePrefix === "[vtop-I") {
        type = 'improvement ';
    }

    assignmentsForum.threads.create({
        name: requestTitle,
        message: {content: `${requestPost} A new ${type}request has been made. Stay tuned, vtop admins will assign a devloper to this request soon.`},
    })
}

function updateStatusInExcel() {
    // needs code
}


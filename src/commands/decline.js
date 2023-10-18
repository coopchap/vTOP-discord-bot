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
    const newPostName = "❌ " + forumPostName;
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
    interaction.reply(`${requester}, I am sorry to report that vtop admins have decided to not continue with your ${type}request.\nI am now going to close this thread.`);
}

function closeThread(interaction) {
    const forumPost = interaction.channel;
    forumPost.setLocked(true);
}

function updateStatusInExcel() {
    // needs code
}
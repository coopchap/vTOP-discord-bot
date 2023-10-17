export async function declineRequestReport(interaction) {
    try {
        if (verifyRequeseted(interaction)) {
            await reply(interaction);
            await closeThread(interaction);
            renameThread(interaction);
            // updateStatusInExcel();
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
    if (titlePrefix === '[vCGP-F' || titlePrefix === '[vCGP-I') {
        return true;
    } else {
        return false;
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
    if (titlePrefix === "[vCGP-F") {
        type = 'feature ';
    } else if (titlePrefix === "[vCGP-I") {
        type = 'improvement ';
    }
    interaction.reply(`${requester}, I am sorry to report that vCGP admins have decided to not continue with your ${type}request.\nI am now going to close this thread.`);
}

function closeThread(interaction) {
    const forumPost = interaction.channel;
    forumPost.setLocked(true);
}

function updateStatusInExcel() {
    // needs code
}
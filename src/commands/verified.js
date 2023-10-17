export async function verifiedReport(interaction) {
    try {
        if (verifyReported(interaction)) {
            await reply(interaction);
            renameThread(interaction);
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
    const newPostName = "✅ " + forumPostName;
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
    interaction.reply(`Congratulations, ${requester}, vCGP admins have decided to approve your ${type}request. I'll update you in this thread when development begins.`);
}

function updateStatusInExcel() {
    // needs code
}


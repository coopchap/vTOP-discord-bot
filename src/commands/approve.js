export async function approveRequestReport(interaction) {
    try {
        if (verifyRequeseted(interaction)) {
            await reply(interaction);
            renameThread(interaction);
            // updateStatusInExcel();
        } else {
            throw new Error('Post is not a feature or improvement request');
        }
    } catch (error) {
        interaction.reply({content: `${error}. You must track the request first using /feature or /improvement`, ephemeral: true});
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

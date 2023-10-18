export async function unverifiableReport(interaction) {
    try {
        if (verifyReported(interaction)) {
            await reply(interaction);
            await closeThread(interaction);
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
    const newPostName = "➖ " + forumPostName;
    forumPost.setName(newPostName);
}

function reply(interaction) {
    const reporter = interaction.options.getUser('reporter');
    interaction.reply(`${reporter}, vCGP developers were not able to verify your bug report. This likely means the issue was not recreatable.\nI am now going to close this thread. If you have this issue again, create a new bug report.`);
}

function closeThread(interaction) {
    const forumPost = interaction.channel;
    forumPost.setLocked(true);
}

function updateStatusInExcel() {
    // needs code
}


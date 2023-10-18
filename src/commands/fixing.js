export function fixingBug(interaction) { 
    try {
        if (verifyReady(interaction)) {
            reply(interaction);
            // updateStatusInExcel();
        } else if (verifyReady(interaction) === "unver") {
            interaction.reply('Can\'t develop report that wasn\'t verified');
        } else {
            interaction.reply({content: 'Error: I was not able to validate whether this post has been verified yet.', ephemeral: true});
        }
    } catch (error) {
        console.error(error);
    }
}

function verifyReady(interaction) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const titlePrefix = forumPostName.slice(0, 9);
    if (titlePrefix === '🪳 [vTOP-') {
        return true;
    } else if (titlePrefix === '➖ [vTOP-B') {
        return 'unver';
    } else {
        return false;
    }
}

function renameThread(interaction) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const truePostName = forumPostName.slice(2)
    const newPostName = "🛠️ " + truePostName;
    forumPost.setName(newPostName);
    return newPostName;
}

async function reply(interaction) {
    const reporter = interaction.options.getUser('reporter');
    await interaction.reply(`${reporter}, vTOP developers have begun developing a fix for your bug report. You can expect to see it live in the next release.`);
    const newName = await renameThread(interaction);
    interaction.followUp({content: `You may need to manually rename this post to "${newName}".`, ephemeral: true})
}

function updateStatusInExcel() {
    // needs code
}


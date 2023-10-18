export async function completed(interaction) {
    try {
        if (verifyRequeseted(interaction)) {
            await reply(interaction);
            renameThread(interaction);
            // updateStatusInExcel();
        } else {
            interaction.reply({content: 'Error: I was not able to validate the status of this post.', ephemeral: true}); 
        }
    } catch (error) {
        console.error(error);
    }
}

function verifyRequeseted(interaction) {
    const forumPost = interaction.channel;
    const forumPostName = forumPost.name;
    const titlePrefix = forumPostName.slice(0, 10);
    if (titlePrefix === '🛠 [vCGP-F' || titlePrefix === '🛠️ [vCGP-I' || titlePrefix === '🛠 [vCGP-B') {
        return true;
    } else {
        return false;
    }
}

function renameThread(interaction) {
    const forumPostName = interaction.channel.name.slice(3);
    const newPostName = "🏁 " + forumPostName;
    interaction.channel.setName(newPostName);
}

function reply(interaction) {
    const requester = interaction.options.getUser('requester');
    const titlePrefix = interaction.channel.name.slice(0, 10);
    if (titlePrefix === "🛠 [vCGP-F") {
        interaction.reply(`${requester}, vCGP developeres have completed implementing your feature request! You can expect to see it in the next release.`);
    } else if (titlePrefix === "🛠 [vCGP-I") {
        interaction.reply(`${requester}, vCGP developeres have completed implementing your improvement request! You can expect to see it in the next release.`);
    } else if (titlePrefix === '🛠 [vCGP-B') {
        interaction.reply(`${requester}, vCGP developeres have completed fixing your bug report! You can expect to see it in the next release.`);
    }
}

function updateStatusInExcel() {
    // needs code
}


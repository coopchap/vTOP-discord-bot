import { fetchTitlePrefix } from "../common.js";

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

async function verifyRequeseted(interaction) {
    const titlePrefix = await fetchTitlePrefix(interaction, 10);
    if (titlePrefix === '🛠 [vTOP-F' || titlePrefix === '🛠️ [vTOP-I' || titlePrefix === '🛠 [vTOP-B') {
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
    if (titlePrefix === "🛠 [vTOP-F") {
        interaction.reply(`${requester}, vTOP developeres have completed implementing your feature request! You can expect to see it in the next release.`);
    } else if (titlePrefix === "🛠 [vTOP-I") {
        interaction.reply(`${requester}, vTOP developeres have completed implementing your improvement request! You can expect to see it in the next release.`);
    } else if (titlePrefix === '🛠 [vTOP-B') {
        interaction.reply(`${requester}, vTOP developeres have completed fixing your bug report! You can expect to see it in the next release.`);
    }
}

function updateStatusInExcel() {
    // needs code
}


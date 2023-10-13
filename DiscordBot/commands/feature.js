import {
    Client,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
} from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

export function addTrackedFeature(interaction) {
    console.log("Feature is now tracked")
    interaction.reply('Feature now tracked');
}
import {
    Client,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
} from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

import { read, writeFileXLSX } from "xlsx";

/* load the codepage support library for extended support with older formats  */
import { set_cptable } from "xlsx";
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
set_cptable(cptable);


export function addTrackedFeature(interaction) {
    var data = XLSX.read(workbook, opts);
    var cell = {c:0, r:0}
    XLSX.utils.sheet_add_aoa(worksheet, ["hello"], { origin: cell });
    console.log(cell.v);
}
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export abstract class BotCommand {
    abstract readonly name: string
    abstract readonly builder: SlashCommandBuilder

    abstract invoke(interaction: ChatInputCommandInteraction): Promise<void>
}

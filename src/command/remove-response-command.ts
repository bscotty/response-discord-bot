import {BotCommand} from "./bot-command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {ResponseRepository} from "../responses/response-repository";

const MATCHER = "to"

export class RemoveResponseCommand extends BotCommand {
    override readonly name = "response-clear"
    override readonly builder = new SlashCommandBuilder()
        .addStringOption((option) => option
            .setName(MATCHER)
            .setDescription("What should I no longer respond to?")
            .setRequired(true)
        )
        .setName(this.name)
        .setDescription("Remove a response")

    private readonly repository: ResponseRepository

    constructor(repository: ResponseRepository) {
        super()
        this.repository = repository
    }

    override async invoke(interaction: ChatInputCommandInteraction): Promise<void> {
        const matcher = interaction.options.getString(MATCHER)
        const response = this.repository.read().find((it) => it.matcher == matcher.toLowerCase())
        if (response) {
            this.repository.remove(response)
            await interaction.reply(`Got it! I'll no longer respond to \"${response.matcher}\"!`)
        } else {
            await interaction.reply(`I can't find any response to \"${matcher}\"!`)
        }
    }
}

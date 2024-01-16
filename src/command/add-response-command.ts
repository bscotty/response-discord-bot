import {BotCommand} from "./bot-command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {ResponseRepository} from "../responses/response-repository";
import {Response} from "../responses/response";

const MATCHER = "to"
const RESPONSE_TEXT = "with"
const WILDCARD = "wildcard"
const REACT = "react"

export class AddResponseCommand extends BotCommand {
    override readonly name = "respond"
    override readonly builder = new SlashCommandBuilder()
        .addStringOption((option) => option
            .setName(MATCHER)
            .setDescription("What do I respond to?")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName(RESPONSE_TEXT)
            .setDescription("What do I respond with?")
            .setRequired(true)
        )
        .addBooleanOption((option) => option
            .setName(WILDCARD)
            .setDescription("Should I look for it in any message?")
            .setRequired(false)
        )
        .addBooleanOption((option) => option
            .setName(REACT)
            .setDescription("Is this an emoji reaction?")
            .setRequired(false)
        )
        .setName(this.name)
        .setDescription("Add a new response")

    private readonly repository: ResponseRepository

    constructor(repository: ResponseRepository) {
        super()
        this.repository = repository
    }

    override async invoke(interaction: ChatInputCommandInteraction): Promise<void> {
        const matcher = interaction.options.getString(MATCHER)
        const response = interaction.options.getString(RESPONSE_TEXT)
        let wildcard = interaction.options.getBoolean(WILDCARD, false)
        if (wildcard == null) {
            wildcard = false
        }
        let react = interaction.options.getBoolean(REACT, false)
        if (react == null) {
            react = false
        }

        const existingResponse = this.repository.read().find((it) => it.matcher == matcher)
        this.repository.add(new Response(matcher.toLowerCase(), response, wildcard, react))
        if (existingResponse) {
            await interaction.reply(`Got it, I'll respond to "${matcher}" with "${response}", but I'll no longer respond with: \"${existingResponse.response_text}\"!`)
        } else {
            await interaction.reply(`Got it, I'll respond to "${matcher}" with "${response}"!`)
        }
    }
}

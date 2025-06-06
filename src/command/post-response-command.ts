import {BotCommand} from "./bot-command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {ResponseRepository} from "../responses/response-repository";

export const POST_RESPONSE_COMMAND_NAME = "post-response"
const RESPONSE_ARG = "to"
const PUBLIC_ARG = "public"

export class PostResponseCommand extends BotCommand {
    override readonly name: string = POST_RESPONSE_COMMAND_NAME
    override readonly builder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription("Post a response")
        .addStringOption((option) => option
            .setName(RESPONSE_ARG)
            .setDescription("the key phrase you want to see the response for")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addBooleanOption((option) => option
            .setName(PUBLIC_ARG)
            .setDescription("Should I post this where everyone can see it?")
            .setRequired(false)
        )

    constructor(private readonly repository: ResponseRepository) {
        super();
    }


    async invoke(interaction: ChatInputCommandInteraction): Promise<void> {
        const matcher = interaction.options.getString(RESPONSE_ARG)
        let postPublicly = interaction.options.getBoolean(PUBLIC_ARG)
        if (postPublicly == null) {
            postPublicly = false
        }
        let responseType: string
        if (postPublicly) {
            responseType = "public"
        } else {
            responseType = "secret"
        }
        console.debug(`Posting a ${responseType} response to ${matcher}`)

        const response = this.repository.read().find((it) => it.matcher == matcher)
        if (response) {
            console.log(`found a response to ${matcher}`)
            if (postPublicly) {
                await interaction.reply({content: response.response_text})
            } else {
                await interaction.reply({content: response.response_text, flags: `Ephemeral`})
            }
        } else {
            console.log(`did not find a response to ${matcher}`)
            const responseText = `I can't find a response to "${matcher}", sorry!`
            if (postPublicly) {
                await interaction.reply({content: responseText})
            } else {
                await interaction.reply({content: responseText, flags: `Ephemeral`})
            }
        }
    }

}
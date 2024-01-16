import {Message} from "discord.js";
import {ResponseRepository} from "../responses/response-repository";

export class MessageCommand {
    private readonly repository: ResponseRepository

    constructor(repository: ResponseRepository) {
        this.repository = repository
    }

    async invoke(interaction: Message): Promise<void> {
        this.repository.read().forEach((response) => {
            const messageText = interaction.content.toLowerCase()
            if (response.wildcard) {
                if (messageText.includes(response.matcher)) {
                    this.respond(interaction, response.reaction, response.responseText)
                }
            } else {
                if (messageText == response.matcher) {
                    this.respond(interaction, response.reaction, response.responseText)
                }
            }
        })
    }

    private async respond(interaction: Message, reaction: boolean, responseText: string) {
        if (reaction) {
            await interaction.react(responseText)
        } else {
            await (await interaction.channel.fetch()).send(responseText)
        }
    }
}
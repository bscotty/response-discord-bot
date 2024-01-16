import {Message, Snowflake} from "discord.js";
import {Response} from "../responses/response";
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
                    this.respond(interaction, response)
                }
            } else {
                if (messageText == response.matcher) {
                    this.respond(interaction, response)
                }
            }
        })
    }

    private async respond(interaction: Message, response: Response) {
        const id = (await interaction.author.fetch()).id
        const responseText = this.decorateResponse(id, response.response_text)
        console.log(`found response to message "${interaction.content}" with ${JSON.stringify(response)}`)
        if (response.reaction) {
            await interaction.react(responseText)
        } else {
            await (await interaction.channel.fetch()).send(responseText)
        }
    }

    private decorateResponse(userId: Snowflake, response: string): string {
        return response.replace("user_id", userId)
    }
}

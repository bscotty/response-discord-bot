import {Client, Message, Snowflake} from "discord.js";
import {Response} from "../responses/response";
import {ResponseRepository} from "../responses/response-repository";

export class MessageCommand {
    private readonly repository: ResponseRepository

    constructor(repository: ResponseRepository) {
        this.repository = repository
    }

    async invoke(interaction: Message, client: Client): Promise<void> {
        this.repository.read().forEach((response) => {
            const messageText = interaction.content.toLowerCase()
            if (response.wildcard) {
                if (messageText.includes(response.matcher)) {
                    this.respond(interaction, response, client)
                }
            } else {
                if (messageText == response.matcher) {
                    this.respond(interaction, response, client)
                }
            }
        })
    }

    private async respond(interaction: Message, response: Response, client: Client) {
        const id = (await interaction.author.fetch()).id
        const responseText = this.decorateResponse(id, response.response_text)
        console.debug(`found response to message "${interaction.content}" with ${JSON.stringify(response)}`)
        if (response.reaction) {
            await interaction.react(responseText)
        } else if (interaction.author.id != client.user.id) {
            await (await interaction.channel.fetch()).send(responseText)
        } else {
            console.debug(`Skipping response posted by the bot user`)
        }
    }

    private decorateResponse(userId: Snowflake, response: string): string {
        return response.replace("user_id", userId)
    }
}

import {ChatInputCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody} from "discord.js";

export abstract class BotCommand {
    abstract readonly name: string
    abstract readonly builder: ConvertableToJson

    abstract invoke(interaction: ChatInputCommandInteraction): Promise<void>
}

export interface ConvertableToJson {
    toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody
}

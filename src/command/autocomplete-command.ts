import {AutocompleteInteraction} from "discord.js";

export interface AutocompleteCommand {
    readonly name: string

    invoke(interaction: AutocompleteInteraction): Promise<void>
}

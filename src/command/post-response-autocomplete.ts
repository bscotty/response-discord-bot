import {AutocompleteInteraction} from "discord.js";
import {POST_RESPONSE_COMMAND_NAME} from "./post-response-command";
import {ResponseRepository} from "../responses/response-repository";
import {AutocompleteCommand} from "./autocomplete-command";

export class PostResponseAutocomplete implements AutocompleteCommand {
    readonly name: string = POST_RESPONSE_COMMAND_NAME

    constructor(private readonly repository: ResponseRepository) {
    }

    async invoke(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused().toLowerCase()
        const responses = this.repository.read()
        const filtered = responses.filter((it) => it.matcher.toLowerCase().includes(focusedValue))
        filtered.length = Math.min(25, filtered.length)
        await interaction.respond(filtered.map((it) => ({name: it.matcher, value: it.matcher})))
    }
}
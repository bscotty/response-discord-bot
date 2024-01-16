export class Response {
    readonly matcher: string
    readonly response_text: string
    readonly wildcard: boolean
    readonly reaction: boolean

    constructor(matcher: string, responseText: string, wildcard: boolean, reaction: boolean) {
        this.matcher = matcher
        this.response_text = responseText
        this.wildcard = wildcard
        this.reaction = reaction
    }
}

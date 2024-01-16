export class Response {
    readonly matcher: string
    readonly responseText: string
    readonly wildcard: boolean
    readonly reaction: boolean

    constructor(matcher: string, responseText: string, wildcard: boolean, reaction: boolean) {
        this.matcher = matcher
        this.responseText = responseText
        this.wildcard = wildcard
        this.reaction = reaction
    }
}
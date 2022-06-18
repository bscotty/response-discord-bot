class Response:
    def __init__(self, matcher, response_text, wildcard=False, reaction=False):
        self.matcher = matcher
        self.response_text = response_text
        self.wildcard = wildcard
        self.reaction = reaction

    def __str__(self):
        return "Response(matcher=\"{0}\", response_text=\"{1}\", wildcard={2}, reaction={3})".format(
            self.matcher, self.response_text, self.wildcard, self.reaction
        )

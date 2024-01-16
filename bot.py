import json
import discord

from response import Response

intents = discord.Intents(
    messages=True,
    reactions=True,
    guilds=True
)

client = discord.Client(
    max_messages=None,
    intents=intents
)

responses = []


@client.event
async def on_ready():
    print("logged in as {0}".format(client.user))
    for guild in client.guilds:
        print("guild: {0}\t with id: {1}".format(guild.name, guild.id))

    file = open("reactions.json")
    for response in json.load(file):
        print(response)
        responses.append(
            Response(
                matcher=response["matcher"],
                response_text=response["response_text"],
                wildcard=response["wildcard"],
                reaction=response["reaction"]
            )
        )


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    message_content = message.content

    if message_content.startswith('!respond'):
        print(f"received command {message_content}")
        if message_content == '!respond help':
            await message.channel.send(
                ("To add a response, call `!respond to \"[message]\" with \"[response]\" (wildcard|react)`\n\n"
                 "To clear a response, call `!respond clear \"[message]\"`\n\n"
                 "Or you can ping Bryan since he knows The Secrets. Remember to use quotes!")
            )
        if message_content.startswith('!respond to'):
            await add_response(message)
        if message_content.startswith('!respond clear'):
            await clear_response(message)
    else:
        for cached_response in responses:
            if cached_response.wildcard:
                if cached_response.matcher.lower() in message_content.lower():
                    if cached_response.reaction:
                        await message.add_reaction(cached_response.response_text)
                        return
                    else:
                        await message.channel.send(decorate_response(cached_response.response_text, message.author))
                        return
            else:
                if message_content.lower() == cached_response.matcher.lower():
                    if cached_response.reaction:
                        await message.add_reaction(cached_response.response_text)
                        return
                    else:
                        await message.channel.send(decorate_response(cached_response.response_text, message.author))
                        return


async def add_response(message):
    message_content = message.content
    words = message_content.split('\"')
    word_count = len(words)
    if word_count < 5:
        await message.channel.send(
            "I can\'t create a response from \"{0}\"".format(message_content)
        )
    else:
        matcher = words[1].strip()
        response = words[3].strip()
        is_wildcard = False
        is_react = False
        if word_count == 5:
            stripped_word = words[4].strip()
            is_wildcard = stripped_word == "wildcard"
            is_react = stripped_word == "react"
            if stripped_word == "wildcard react":
                is_wildcard = True
                is_react = True
            if stripped_word == "react wildcard":
                is_wildcard = True
                is_react = True
        new_response = Response(matcher, response, is_wildcard, is_react)
        add_to_cache(new_response)
        await message.add_reaction("✅")


async def clear_response(message):
    message_content = message.content
    words = message_content.split('\"')
    word_count = len(words)
    if word_count < 3:
        await message.channel.send(
            "Cannot erase response from command \"{0}\"".format(message_content)
        )
    else:
        matcher = words[1]
        remove_from_cache(matcher)
        delete_response_from_json(matcher)
        await message.add_reaction("✅")


def add_to_cache(response):
    matched = next((cached_response for cached_response in responses if cached_response.matcher == response.matcher),
                   None)
    if matched is not None:
        print("overriding existing response: {0}".format(matched))
        responses.remove(matched)
        delete_response_from_json(response.matcher)
    else:
        print("adding new response {0}".format(response.matcher))

    responses.append(response)
    add_response_to_json(response)


def remove_from_cache(matcher):
    matched = next(cached_response for cached_response in responses if cached_response.matcher == matcher)
    if matched is None:
        print("cannot find response {0}".format(matcher))
        return
    else:
        print("found response to clear: {0}".format(matched))
        responses.remove(matched)


def delete_response_from_json(matcher):
    file = open("reactions.json", "r+")
    json_blob = json.load(file)
    found = False
    for i in range(len(json_blob)):
        if json_blob[i]['matcher'] == matcher:
            del json_blob[i]
            found = True
            break
    if found:
        print("Deleted {0} from the json file".format(matcher))
    else:
        print("Can't delete {0} from the json file".format(matcher))
    file.seek(0)
    file.write(json.dumps(json_blob, indent=2))
    file.truncate()


def add_response_to_json(response):
    file = open("reactions.json", "r+")
    json_blob = json.load(file)
    json_blob.append(response.__dict__)
    file.seek(0)
    file.write(json.dumps(json_blob, indent=2))
    file.truncate()


def decorate_response(response_text, user):
    return response_text.replace("user_id", str(user.id))

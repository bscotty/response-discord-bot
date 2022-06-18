import json

import bot

file = open("config.json")

bot.client.run(json.load(file)["token"])

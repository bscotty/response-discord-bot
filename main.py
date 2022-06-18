import bot
import json

file = open("config.json")

bot.client.run(json.load(file)["token"])

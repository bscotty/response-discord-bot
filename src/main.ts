import {ConfigImpl} from "./bot/config";
import {Bot} from "./bot/bot";
import {AddResponseCommand} from "./command/add-response-command";
import {ResponseRepository} from "./responses/response-repository";
import {RemoveResponseCommand} from "./command/remove-response-command";
import {MessageCommand} from "./command/message-command";
import {PostResponseCommand} from "./command/post-response-command";
import {PostResponseAutocomplete} from "./command/post-response-autocomplete";

const config = new ConfigImpl()
const bot = new Bot(config)
const repository = new ResponseRepository()

const commands = [
    new AddResponseCommand(repository),
    new RemoveResponseCommand(repository),
    new PostResponseCommand(repository)
]

const autocompleteCommands = [
    new PostResponseAutocomplete(repository)
]

bot.login()
    .then(async () => {
        await bot.addCommands(commands, autocompleteCommands, new MessageCommand(repository))
            .catch((reason) => console.error(reason))
    })
    .catch((reason) => console.error(reason))

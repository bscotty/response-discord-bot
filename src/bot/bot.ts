import {Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Config} from "./config";
import {BotCommand} from "../command/bot-command";
import {MessageCommand} from "../command/message-command";

export class Bot {
    protected readonly client: Client
    protected readonly rest: REST
    protected readonly config: Config

    constructor(config: Config) {
        this.config = config
        const options = {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        }
        this.rest = new REST({version: "10"}).setToken(this.config.botToken)
        this.client = new Client(options)
        this.client.once("ready", () => {
            console.log("ready")
        })
    }

    public async login() {
        await this.client.login(this.config.botToken)
            .then(() => console.log("logged in"))
            .catch((reason) => console.error(reason))
    }

    public async addCommands(interactionCreateCommands: BotCommand[], messageCommand: MessageCommand) {
        await this.registerCommands(interactionCreateCommands.map((it) => it.builder))

        if (interactionCreateCommands.length == 0)
            throw Error("Empty slash command list")

        this.listenForCommands(interactionCreateCommands, messageCommand)
    }

    private async registerCommands(commands: SlashCommandBuilder[]) {
        const requests: Promise<void>[] = this.config.guildIds.map(async (guild) => {
            const route = Routes.applicationGuildCommands(this.config.botApplicationId, guild)
            const body = {body: commands.map((it) => it.toJSON())}
            await this.rest.put(route, body)
                .then(() => {
                    const commandNames = commands.map((it) => it.name).join(",")
                    console.log(`put commands [${commandNames}] to guild ${guild}`)
                })
        })
        await Promise.all(requests)
            .then(() => console.log("all commands registered"))
            .catch((reason) => console.error(reason))
    }

    private listenForCommands(interactionCreateCommands: BotCommand[], messageCommand: MessageCommand) {
        this.client.on("interactionCreate", async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const {commandName} = interaction

            const command = interactionCreateCommands.find((it) => it.name == commandName)
            if (command) {
                await command.invoke(interaction)
            }
        })

        this.client.on("messageCreate", async interaction => {
            await messageCommand.invoke(interaction)
        })

        this.client.on("threadCreate", async interaction => {
            await interaction.join()
        })
    }
}

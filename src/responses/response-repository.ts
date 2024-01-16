import fs from "fs";
import {Response} from "./response";

export class ResponseRepository {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly jsonReader: JsonFileReader<any[]> = new JsonFileReader("/../../../reactions.json")

    public read(): Response[] {
        return this.jsonReader.getJson()
            .map((it) => new Response(it["matcher"], it["response_text"], it["wildcard"], it["reaction"]))
    }

    public remove(response: Response) {
        const array = this.read().filter((it) => it.matcher != response.matcher)
        this.jsonReader.write(array)
    }

    public add(response: Response) {
        const array = this.read().concat(response)
        this.jsonReader.write(array)
    }
}

class JsonFileReader<T> {
    readonly path: string

    constructor(path: string) {
        this.path = path
    }

    write(input: T) {
        fs.writeFileSync(this.file(), JSON.stringify(input, null, 2))
    }

    getJson(): T {
        const string = fs.readFileSync(this.file(), {encoding: "utf8"})
        return JSON.parse(string)
    }

    private file(): string {
        return __dirname + this.path
    }
}

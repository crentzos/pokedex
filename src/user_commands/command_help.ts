import { State } from "../state.js";

export async function commandHelp(state: State): Promise<void> {
    console.log("Display Help");
    console.log("Usage:\n");

    for (const cmd of Object.values(state.commands)) {
        console.log(`${cmd.name}: ${cmd.description}`);
    }
}
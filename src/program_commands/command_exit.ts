import { capitalize } from "src/utilities";
import { State } from "../state";

export async function commandExit(state: State): Promise<void> {
    const greeting = state.currentUser ?
        ` ${capitalize(state.currentUser.profile.name)}`
        : "";

    console.log(`Closing the Pokedex... Goodbye${greeting}!`);
    state.replServer?.close();
}
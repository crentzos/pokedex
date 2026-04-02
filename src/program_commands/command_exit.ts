import { State } from "../state";

export async function commandExit(state: State): Promise<void> {
    const greeting = state.currentUser ?
        ` ${state.currentUser.profile.name}`
        : "";

    console.log(`Closing the Pokedex... Goodbye${greeting}!`);
    state.replServer?.close();
}
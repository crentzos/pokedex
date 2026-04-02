import { State } from "../state";

export async function commandPokedex(state: State): Promise<void> {
    if (!state.currentUser) {
        console.log("Please log in to have access to your Pokedex.");
        return;
    }
    const pokedexKeys = Object.keys(state.currentUser.pokedex);

    if (pokedexKeys.length === 0) {
        console.log("Your Pokedex is empty! You haven’t caught any Pokemon yet.");
        return;
    }

    console.log("Your Pokedex:")
    for (const pokemonName of Object.keys(state.currentUser.pokedex)) {
        console.log(`- ${pokemonName}`);
    }
}
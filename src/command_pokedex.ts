import { State } from "./state.js";

export async function commandPokedex(state: State): Promise<void> {
    const pokedexKeys = Object.keys(state.usersPokedex);

    if (pokedexKeys.length === 0) {
        console.log("Your Pokedex is empty! You haven’t caught any Pokemon yet.");
        return;
    }

    console.log("Your Pokedex:")
    for (const pokemonName of Object.keys(state.usersPokedex)) {
        console.log(`- ${pokemonName}`);
    }
}
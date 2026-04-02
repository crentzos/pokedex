import { State } from "../state";

export async function commandInspect(state: State, ...args: string[]): Promise<void> {
    if (!state.currentUser) {
        console.log("Please log in to have access to your Pokedex.");
        return;
    }


    if (args.length === 0 || !args[0]) {
        console.log("Please type the name of the pokemon you want to inspect.");
        return;
    }

    const pokemonName = args[0].toLowerCase();
    const pokemon = state.currentUser.pokedex[pokemonName];

    if (pokemon === undefined) {
        console.log(`You have not caught ${pokemonName}.`);
        return;
    }


    console.log(`Name: ${pokemon.name}`);
    console.log(`Height: ${pokemon.height}`);
    console.log(`Weight: ${pokemon.weight}`);
    console.log("Stats:");
    for (const [statName, value] of Object.entries(pokemon.stats)) {
        console.log(`-${statName}: ${value}`);
    }
    console.log("Types:");
    for (const type of pokemon.types) {
        console.log(`  - ${type}`);
    }

}
import { State } from "../state";

export async function commandInspect(state: State, ...args: string[]): Promise<void> {
    const pokemonName = args[0];
    const pokemon = state.usersPokedex[pokemonName];
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
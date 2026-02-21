import { State } from "./state"

export async function commandExplore(state: State, ...args: string[]) {
    if (args.length === 0) {
        console.log("You must provide a location name.");
        return;
    }
    const areaName = args[0];

    const areaData = await state.pokeAPI.fetchEncounters(areaName);

    console.log(`Exploring ${areaName}...`);
    console.log("Found Pokemon:");
    for (const encounter of areaData.pokemon_encounters) {
        console.log(` - ${encounter.pokemon.name}`);
    }
}
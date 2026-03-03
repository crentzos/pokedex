import { State } from "../state"

export async function commandMapb(state: State) {

    if (!state.previousLocationsURL) {
        console.log("You're on the first page.");
        return;
    }

    const locations = await state.pokeAPI.fetchLocations(state.previousLocationsURL);

    for (const loc of locations.results) {
        console.log(loc.name);
    }

    state.nextLocationsURL = locations.next;
    state.previousLocationsURL = locations.previous;
}
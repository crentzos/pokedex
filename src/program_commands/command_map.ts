import { saveUserData } from "src/persistence";
import { State } from "../state"

export async function commandMap(state: State) {
    const targetURL = state.nextLocationsURL || undefined;
    const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL || undefined);

    for (const loc of locations.results) {
        console.log(loc.name);
    }

    state.nextLocationsURL = locations.next;
    state.previousLocationsURL = locations.previous;

    if (state.currentUser) {
        state.currentUser.lastLocationURL = targetURL || "https://pokeapi.co/api/v2/location-area";

        await saveUserData(state.currentUser.profile.name, state.currentUser.userData);
    }
}
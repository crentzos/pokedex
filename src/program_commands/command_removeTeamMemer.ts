import { saveUserData } from "src/persistence";
import { State } from "src/state";
import { capitalize } from "src/utilities";

export async function commandRemoveTeamMember(state: State, ...args: string[]): Promise<void> {
    if (!state.currentUser) {
        console.log("Please log in to have access to your team.");
        return;
    }
    const name = args[0];

    if (!name) {
        console.log("Please type the Pokemon name you want to remove.");
        return;
    }

    const result = state.currentUser.removeMember(name);
    const pokemonName = capitalize(name);

    if (!result) {
        console.log(`${pokemonName} is not on your team.`)
        return;
    }

    await saveUserData(state.currentUser.profile.name, state.currentUser.userData);
    console.log(`${pokemonName} was removed from your team.`)
}

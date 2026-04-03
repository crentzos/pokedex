import { saveUserData } from "src/persistence";
import { State } from "src/state";
import { capitalize } from "src/utilities";

export async function commandAddTeamMember(state: State, ...args: string[]): Promise<void> {
    if (!state.currentUser) {
        console.log("Please log in to have access to your team.");
        return;
    }

    const name = args[0];

    if (!name) {
        console.log("Please type the Pokemon name you want to add.");
        return;
    }

    const result = state.currentUser.addMember(name);
    const pokemonName = capitalize(name);

    if (result === "SUCCESS") {
        console.log(`${pokemonName} was added to your team!`);
        await saveUserData(state.currentUser.profile.name, state.currentUser.userData);
    } else if (result === "NOT_CAUGHT") {
        console.log(`You have not caught ${pokemonName}.`);
    } else if (result === "ALREADY_IN_TEAM") {
        console.log(`${pokemonName} is already on your team!`);
    } else if (result === "TEAM_FULL") {
        console.log("Your team is already full. Remove a pokemon to add a new one.");
    }
}
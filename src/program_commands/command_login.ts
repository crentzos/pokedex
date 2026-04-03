import { capitalize } from "src/utilities";
import { loadUserData, userExists } from "../persistence";
import { State } from "../state";
import { User } from "../user";
import { interviewHandler } from "./interviewHandler";


export async function commandLogin(state: State, username: string, ...args: string[]) {
    if (!username) {
        console.log("Please provide a username. (e.g Ash)");
    }

    if (await userExists(username)) {
        console.log(`Welcome back ${capitalize(username)}. Loading your Pokedex...`);
        const userData = await loadUserData(username);
        state.currentUser = new User(userData.profile, userData.pokedex, userData.lastLocationURL);
        state.nextLocationsURL = userData.lastLocationURL;
        return;
    }

    await interviewHandler(username, state)
}
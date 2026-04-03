import { State } from "src/state";
import { capitalize } from "src/utilities";

export async function commandTeam(state: State): Promise<void> {
    if (!state.currentUser) {
        console.log("Please log in to have access to your team.");
        return;
    }

    const team = state.currentUser.team;

    if (team.length === 0) {
        console.log("There are no Pokemon in your team yet.");
        return;
    }

    console.log("Your team:");
    for (const pokemon of team) {
        console.log(`-${capitalize(pokemon)}`);
    }

}
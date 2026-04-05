import { saveUserData } from "src/persistence";
import { State } from "src/state";
import { Inventory } from "src/user";

export async function commandRoll(state: State): Promise<void> {
    const BALL_NAMES: Record<keyof Inventory, string> = {
        pokeballs: "Poke Ball",
        greatballs: "Great Ball",
        ultraballs: "Ultra Ball",
        masterballs: "Master Ball"
    };

    if (!state.currentUser) {
        console.log("Please log in to have access to your Pokedex's gatcha function.");
        return;
    }

    if (!state.currentUser.canRoll()) {
        console.log("You've used all your rolls for today! You can try again after 00:00:00!");
        return;
    }

    state.currentUser.resetGachaIfNewDay();

    const roll = Math.random() * 100;
    let ballKey: keyof Inventory;
    let displayName;

    if (roll < 3) {
        ballKey = "masterballs";
    } else if (roll < 12) {
        ballKey = "ultraballs";
    } else if (roll < 33) {
        ballKey = "greatballs";
    } else {
        ballKey = "pokeballs";
    }

    state.currentUser.userData.inventory[ballKey]++;
    state.currentUser.userData.gatcha.rollsToday++;

    console.log(`Congratulations! You won a ${BALL_NAMES[ballKey]}!`);
    console.log(`Remaining rolls today: ${3 - state.currentUser.userData.gatcha.rollsToday}`);

    await saveUserData(state.currentUser.profile.name, state.currentUser.userData);
}
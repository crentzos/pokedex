import { State } from "src/state";

export async function commandInventory(state: State) {
    if (!state.currentUser) {
        console.log("Please log in to have access to your inventory.");
        return;
    }

    const inv = state.currentUser.userData.inventory;
    console.log("Your inventory items:");
    console.log(`Poke Balls:   ${inv.pokeballs}`);
    console.log(`Great Balls:  ${inv.greatballs}`);
    console.log(`Ultra Balls:  ${inv.ultraballs}`);
    console.log(`Master Balls: ${inv.masterballs}`);
}
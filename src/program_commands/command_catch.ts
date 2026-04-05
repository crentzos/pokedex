import console, { log } from "node:console";
import { State } from "../state.js"
import { saveUserData } from "../persistence.js";
import { capitalize } from "src/utilities.js";
import { Inventory } from "src/user.js";



export async function commandCatch(state: State, ...args: string[]) {
    if (!state.currentUser) {
        console.log("Please log in to have access to your Pokedex.");
        return;
    }

    if (args.length === 0) {
        console.log("You must provide a pokemon name.");
        return;
    }


    const pokemonName = args[0].toLowerCase();
    const ballNameInput = args[1]?.toLowerCase() || "pokeballs";
    let ballKey: keyof Inventory;
    const inventory = state.currentUser.userData.inventory;


    if (ballNameInput.startsWith("master")) {
        ballKey = "masterballs";
    } else if (ballNameInput.startsWith("ultra")) {
        ballKey = "ultraballs";
    } else if (ballNameInput.startsWith("great")) {
        ballKey = "greatballs";
    } else if (ballNameInput.startsWith("poke")) {
        ballKey = "pokeballs";
    } else {
        console.log(`'${ballNameInput}' is not a valid type of Pokeball!`);
        return;
    }


    if (inventory[ballKey] <= 0) {
        console.log(`You don't have any ${ballKey}!`);
        return;
    }


    let multiplier = 1.0;

    if (ballKey === "greatballs") multiplier = 1.5;
    else if (ballKey === "ultraballs") multiplier = 2.0;
    else if (ballKey === "masterballs") multiplier = 100.0;


    try {
        const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);

        if (state.currentUser.pokedex[pokemonName]) {
            console.log(`You have already caught ${capitalize(pokemonName)}!`);
            return;
        }

        const friendlyName = capitalize(ballKey.replace('balls', ' Ball'));
        console.log(`Throwing a(n) ${friendlyName} at ${capitalize(pokemonName)}...`);

        const catchDifficulty = Math.min(pokemon.base_experience / 345, 0.99);

        const chanceToCatch = Math.random() * multiplier > catchDifficulty;

        state.currentUser.userData.inventory[ballKey]--;

        if (chanceToCatch) {
            state.currentUser.addPokemon(pokemonName, pokemon);
            await saveUserData(state.currentUser.profile.name, state.currentUser.userData);
            console.log(`${capitalize(pokemonName)} was caught!`);

        } else {
            await saveUserData(state.currentUser.profile.name, state.currentUser.userData);
            console.log(`${capitalize(pokemonName)} escaped!`);
        }
    } catch (error: any) {
        if (error.message.includes("404") || error.message.toLowerCase().includes("not found")) {
            console.log(`Error:'${capitalize(pokemonName)}' does not exist in the Pokemon database . Please check your spelling.`);
        } else {
            console.log("Error: Could not connect to the Pokemon database.");
        }
    }
}
import console, { log } from "node:console";
import { State } from "../state.js"
import { saveUserData } from "../persistence.js";



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

    const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);



    const chanceToCatch: boolean = Math.random() > (pokemon.base_experience / 500);

    if (chanceToCatch) {
        const wasAdded = state.currentUser.addPokemon(pokemonName, pokemon);
        if (wasAdded) {
            console.log(`Throwing a Pokeball at ${pokemonName}...`);
            await saveUserData(state.currentUser.profile.name, state.currentUser.userData);
            console.log(`${pokemonName} was caught!`);
        }
    } else {
        console.log(`${pokemonName} escaped!`);
    }

}
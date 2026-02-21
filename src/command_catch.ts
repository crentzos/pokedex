import { State } from "./state.js"
import { Pokemon } from "./pokeAPI.js"



export async function commandCatch(state: State, ...args: string[]) {
    if (args.length === 0) {
        console.log("You must provide a pokemon name.");
        return;
    }
    const pokemonName = args[0];

    const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);


    console.log(`Throwing a Pokeball at ${pokemonName}...`);
    const chanceToCatch: boolean = Math.random() > (pokemon.base_experience / 500);

    if (chanceToCatch) {
        if (!state.usersPokedex[pokemonName]) {
            state.usersPokedex[pokemonName] = pokemon;
        }
        console.log(`${pokemonName} was caught!`);
    } else {
        console.log(`${pokemonName} escaped!`);
    }

}
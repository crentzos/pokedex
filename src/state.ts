import { createInterface, type Interface } from "readline";
import { PokeApi, Pokemon } from "./pokeAPI.js";

import { CLICommand, getCommands } from "./commands.js";


export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
    pokeAPI: PokeApi;
    nextLocationsURL: string | null;
    previousLocationsURL: string | null;
    usersPokedex: Record<string, Pokemon>;
};

export function initState() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> ",
    });


    const pokeAPI = new PokeApi(20000);


    return {
        rl,
        commands: getCommands(),
        pokeAPI,
        nextLocationsURL: null,
        previousLocationsURL: null,
        usersPokedex: {},
    }
}
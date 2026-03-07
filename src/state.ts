import { PokeApi, Pokemon } from "./pokeAPI.js";

import { CLICommand, getCommands } from "./commands.js";
import { REPLServer } from "node:repl";


export type State = {
    commands: Record<string, CLICommand>;
    pokeAPI: PokeApi;
    nextLocationsURL: string | null;
    previousLocationsURL: string | null;
    usersPokedex: Record<string, Pokemon>;
    replServer: REPLServer | null;
};

export function initState() {
    const pokeAPI = new PokeApi(20000);

    return {
        commands: getCommands(),
        pokeAPI,
        nextLocationsURL: null,
        previousLocationsURL: null,
        usersPokedex: {},
        replServer: null,
    }
}
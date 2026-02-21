import { commandCatch } from "./command_catch.js";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandInspect } from "./command_inspect.js";
import { commandPokedex } from "./command_pokedex.js";
import { commandExplore } from "./explore.js";
import { commandMap } from "./map.js";
import { commandMapb } from "./mapb.js";
import { State } from "./state.js";

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>;
}


export function getCommands(): Record<string, CLICommand> {
    return {
        exit: {
            name: "exit",
            description: "Exits the pokedex",
            callback: commandExit,
        },
        help: {
            name: "help",
            description: "Displays help commands",
            callback: commandHelp,
        },
        map: {
            name: "map",
            description: "Prints the map locations by 20. Each time you call the command prints the next 20 locations till end of file.",
            callback: commandMap
        },
        mapb: {
            name: "mapb",
            description: "Prints the previous map locations by 20. Each time you call the command prints the previous 20 locations till end of file.",
            callback: commandMapb
        },
        explore: {
            name: "explore <location_name>",
            description: "Prints all the pokemon you can encounter in a specific area.",
            callback: commandExplore
        },
        catch: {
            name: "catch <pokemon-name>",
            description: "Throws pokeball at specified pokemon in order to catch it.",
            callback: commandCatch
        },
        inspect: {
            name: "inspect <pokemon-name>",
            description: "Prints the information of specified pokemon, if already caught.",
            callback: commandInspect,
        },
        pokedex: {
            name: "pokedex",
            description: "Prints all the Pokemon in your pokedex.",
            callback: commandPokedex,
        }
    }
}
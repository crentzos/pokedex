
import { State } from "./state.js";
import { commandCatch } from "./program_commands/command_catch.js";
import { commandExit } from "./program_commands/command_exit.js";
import { commandHelp } from "./program_commands/command_help.js";
import { commandInspect } from "./program_commands/command_inspect.js";
import { commandPokedex } from "./program_commands/command_pokedex.js";
import { commandExplore } from "./program_commands/command_explore.js";
import { commandMap } from "./program_commands/command_map.js";
import { commandMapb } from "./program_commands/command_mapback.js";
import { commandLogin } from "./program_commands/command_login.js";
import { commandReset } from "./program_commands/reset_command.js";
import { commandAddTeamMember } from "./program_commands/command_addTeamMember.js";
import { commandRemoveTeamMember } from "./program_commands/command_removeTeamMemer.js";
import { commandTeam } from "./program_commands/command_team.js";


export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>;
}


export function getCommands(): Record<string, CLICommand> {
    return {
        exit: {
            name: "exit",
            description: "Exits the pokedex.",
            callback: commandExit,
        },
        help: {
            name: "help",
            description: "Displays the available commands.",
            callback: commandHelp,
        },
        map: {
            name: "map",
            description: "Prints the map locations by 20. Each time you call the command prints the next 20 locations till end of file. If a user is logged in the first time he/she types map, it will show the last 20 locations he/she viewed.",
            callback: commandMap
        },
        mapb: {
            name: "mapb",
            description: "Prints the previous map locations by 20. Each time you call the command prints the previous 20 locations till end of file.If a user is logged in the first time he/she types mapb, it will show the last 20 locations he/she viewed.",
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
        },
        login: {
            name: "login",
            description: "Logs in the current user.",
            callback: commandLogin,
        },
        reset: {
            name: "reset",
            description: "Removes all existing users.",
            callback: commandReset
        },
        add: {
            name: "add <pokemon-name>",
            description: "Adds the selected pokemon to your team.",
            callback: commandAddTeamMember
        },
        remove: {
            name: "remove <pokemon-name>",
            description: "Removes the selected pokemon to your team.",
            callback: commandRemoveTeamMember
        },
        team: {
            name: "team",
            description: "Lists the pokemon in your team.",
            callback: commandTeam
        }
    }
}
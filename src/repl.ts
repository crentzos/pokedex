import { interviewHandler } from "./program_commands/interviewHandler.js";
import { State } from "./state.js";
import repl from "node:repl";


export function cleanInput(input: string): string[] {
    return input.toLowerCase().trim().split(/\s+/).filter(word => word !== "");

}

export async function handleCommand(
    cmd: string,
    state: State,
    reprompt: (err: Error | null, result?: any) => void
) {
    if (state.interview) {
        await interviewHandler(cmd, state);
        return reprompt(null);
    }

    const words = cleanInput(cmd);
    if (words.length === 0) return reprompt(null);

    const command = state.commands[words[0]];

    if (!command) {
        console.log(`Command ${words[0]} does not exist...`);
        return reprompt(null);
    }

    if (state.activeBattle) {
        const allowedInBattle = ["attack", "run", "swap", "exit", "team"];
        if (!allowedInBattle.includes(words[0])) {
            console.log("--------------------------------------------------");
            console.log(`You cannot ${words[0]} while in battle!`);
            console.log("Available commands: attack <type-of-attack>, run, swap <pokemon-name>, exti, team.");
            return reprompt(null);
        }
    }


    try {
        await command.callback(state, ...words.slice(1));
        reprompt(null);
    } catch (error: any) {
        console.log(`Error: ${error.message}`);
        return reprompt(null);
    }
}

export async function startREPL(state: State) {
    console.log("Welcome to the Pokedex! Type 'help' to see available commands.");

    state.replServer = repl.start({
        prompt: "pokedex > ",
        eval: (async (cmd: string, _context: any, _filename: string, reprompt: (err: Error | null, result?: any) => void) => {
            await handleCommand(cmd, state, reprompt);
        }) as any
    });

    state.replServer.on('exit', () => {
        process.exit(0);
    });
}


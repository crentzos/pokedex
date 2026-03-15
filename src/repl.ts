import { State } from "./state.js";
import repl from "node:repl";

export function cleanInput(input: string): string[] {
    return input.toLowerCase().trim().split(/\s+/).filter(word => word !== "");

}

export async function startREPL(state: State) {
    console.log("Welcome to the Pokedex! Type 'help' to see available commands.");
    state.replServer = repl.start({
        prompt: "pokedex > ",
        eval: (async (cmd: string, _context: any, _filename: string, reprompt: (err: Error | null, result?: any) => void) => {
            const words = cleanInput(cmd);

            if (words.length === 0) {
                return reprompt(null);
            }

            const command = state.commands[words[0]];

            if (!command) {
                console.log(`Command ${words[0]} does not exist. Please type a valid command. You can type help to see all the available commands.`);
                return reprompt(null);
            }

            try {
                await command.callback(state, ...words.slice(1));
                reprompt(null);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(`Error: ${error.message}`);
                } else {
                    console.log(`An unexpected error occurred while running ${words[0]}.`);
                }
            }
        }) as any

    });

    state.replServer.on('exit', () => {
        process.exit(0);
    });
}
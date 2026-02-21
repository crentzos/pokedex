import { State } from "./state.js";


export function cleanInput(input: string): string[] {
    return input.trim().split(/\s+/).filter(word => word !== "");

}

export async function startREPL(state: State) {
    console.log("Welcome to the Pokedex! Type 'help' to see available commands.");
    state.rl.prompt();


    state.rl.on("line", async (input) => {

        const words: string[] = cleanInput(input);
        if (words.length === 0) {
            state.rl.prompt();
            return;
        }

        const command = state.commands[words[0]];


        if (!command) {
            console.log(`Command ${words[0]} does not exist. Please type a valid command.`);
            state.rl.prompt();
            return;
        }

        try {
            await command.callback(state, ...words.slice(1));
        } catch (error) {
            console.log("An error occurred while running that command.");
        }


        state.rl.prompt();
    }
    )
};


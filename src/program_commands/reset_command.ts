import fs from "node:fs/promises";
import path from "node:path";
import { State } from "src/state";

export async function commandReset(state: State) {
    const USERS_DIR = path.join(process.cwd(), "data", "users");

    try {
        await fs.rm(USERS_DIR, { recursive: true, force: true });
        await fs.mkdir(USERS_DIR, { recursive: true });


        state.currentUser = null;

        console.log("All user profiles have been deleted. Starting fresh!");
    } catch (error) {
        console.log("Error during reset:", error);
    }
}
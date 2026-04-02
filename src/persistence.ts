import path from "node:path";
import { UserData } from "./user";
import fs from "node:fs/promises";

const USERS_DIR = path.join(process.cwd(), "data", "users");

//turn user object to json file and save
export async function saveUserData(username: string, data: UserData,): Promise<void> {
    const filepath = path.join(USERS_DIR, `${username.toLowerCase()}.json`);

    //ensure directory exists
    await fs.mkdir(USERS_DIR, { recursive: true });

    const json = JSON.stringify(data, null, 2);

    await fs.writeFile(filepath, json, "utf8");
}

//reads json file and returns the user data
export async function loadUserData(username: string): Promise<UserData> {
    const filePath = path.join(USERS_DIR, `${username.toLowerCase()}.json`);
    const content = await fs.readFile(filePath, "utf8");

    return JSON.parse(content) as UserData;
}

export async function userExists(username: string): Promise<boolean> {
    const filePath = path.join(USERS_DIR, `${username.toLowerCase()}.json`);
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function getAllBadgeIds(): Promise<string[]> {
    try {
        const files = await fs.readdir(USERS_DIR);
        const ids: string[] = [];

        for (const file of files) {
            if (file.endsWith(".json")) {
                const content = await fs.readFile(path.join(USERS_DIR, file), "utf8");
                const data = JSON.parse(content) as UserData;
                ids.push(data.profile.passId);
            }
        }
        return ids;
    } catch {
        return []; // If folder doesn't exist yet
    }
}
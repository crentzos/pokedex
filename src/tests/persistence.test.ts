import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { saveUserData, loadUserData, userExists } from "../persistence.js";
import { UserData } from "../user.js";

const TEST_DIR = path.join(process.cwd(), "data", "test_users");

describe("Persistence Service", () => {
    const mockUser: UserData = {
        profile: { passId: "1", name: "Tester", dob: "2000-01-01", gender: "none" },
        pokedex: {},
        lastLocationURL: null
    };

    beforeEach(async () => {
        await fs.rm(path.join(process.cwd(), "data", "users"), { recursive: true, force: true });
    });

    afterEach(async () => {
        await fs.rm(TEST_DIR, { recursive: true, force: true });
    });

    test("saveUserData should create a JSON file on disk", async () => {
        const username = "testbot";
        await saveUserData(username, mockUser);

        const filePath = path.join(process.cwd(), "data", "users", `${username}.json`);
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        expect(fileExists).toBe(true);

        const content = await fs.readFile(filePath, "utf8");
        const parsed = JSON.parse(content);
        expect(parsed.profile.name).toBe("Tester");
    });

    test("userExists should return true if file exists, false otherwise", async () => {
        const username = "exists_check";

        expect(await userExists(username)).toBe(false);

        await saveUserData(username, mockUser);

        expect(await userExists(username)).toBe(true);
    });

    test("loadUserData should retrieve and parse a saved user", async () => {
        const username = "loader_bot";
        await saveUserData(username, mockUser);

        const loadedData = await loadUserData(username);

        expect(loadedData.profile.name).toBe("Tester");
        expect(loadedData.profile.passId).toBe("1");
    });
});
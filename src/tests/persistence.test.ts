import { describe, expect, test, beforeEach, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { saveUserData, loadUserData, userExists } from "../persistence.js";
import { UserData } from "../user.js";

const TEST_DIR = path.join(process.cwd(), "data", "test_users");

vi.mock("node:fs/promises");

describe("Persistence Service", () => {
    const mockUser: UserData = {
        profile: { passId: "1", name: "Tester", dob: "2000-01-01", gender: "none" },
        pokedex: {},
        lastLocationURL: null
    };

    vi.mock("node:fs/promises");

    beforeEach(async () => {
        vi.clearAllMocks();
    });



    test("saveUserData should create a JSON file on disk", async () => {
        const username = "testbot";
        await saveUserData(username, mockUser);

        expect(fs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining("testbot.json"),
            expect.stringContaining("Tester"),
            "utf8"
        );
    });

    test("userExists should return true if file exists, false otherwise", async () => {
        vi.mocked(fs.access).mockRejectedValue(new Error("file not found."));

        const exists = await userExists("ghost_user");
        expect(exists).toBe(false);
    });

    test("loadUserData should retrieve and parse a saved user", async () => {
        const fakeFileContent = JSON.stringify(mockUser);

        vi.mocked(fs.readFile).mockResolvedValue(fakeFileContent);

        const data = await loadUserData("loader_bot");

        expect(data.profile.name).toBe("Tester");
        expect(fs.readFile).toHaveBeenCalled();
    });
});
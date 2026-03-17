import { describe, expect, test, vi } from "vitest";
import { initState, State } from "../state.js";
import { CLICommand } from "src/commandsRegistry.js";

describe("Pokedex command system", () => {
    let state: State;

    beforeEach(() => {
        state = initState();
    });

    describe("Registry integrity", () => {
        test("should contain all core commands", () => {
            const required = ["help", "exit", "map", "mapb", "explore", "catch", "inspect", "pokedex"];
            required.forEach(cmd => {
                expect(state.commands).toHaveProperty(cmd);
            });
        });

        test("all commands should follow the CLICommand contract", () => {
            Object.values(state.commands).forEach((cmd: CLICommand) => {
                expect(typeof cmd.description).toBe("string");
                expect(cmd.description.length).toBeGreaterThan(0);
                expect(typeof cmd.callback).toBe("function");
            });
        });
    });
});
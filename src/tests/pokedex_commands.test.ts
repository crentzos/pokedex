import { describe, expect, Mock, test, vi } from "vitest";
import { initState, State } from "../state.js";

describe("Pokedex command suite", () => {
    let state: State;
    let logSpy: ReturnType<typeof vi.spyOn>;;

    beforeEach(() => {
        state = initState();
        logSpy = vi.spyOn(console, "log");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Collection Domain", () => {
        describe("pokedex command", () => {
            test("should log message when pokedex empty", async () => {
                const pokedexCmd = state.commands["pokedex"];


                await pokedexCmd.callback(state);
                expect(logSpy).toHaveBeenCalledWith(
                    expect.stringContaining("Your Pokedex is empty! You haven’t caught any Pokemon yet.")
                );
            });

            test("should list all caught pokemon when NOT empty", async () => {
                const pokedexCmd = state.commands["pokedex"];

                state.usersPokedex = {
                    "pikachu": { name: "pikachu" } as any,
                    "mew": { name: "mew" } as any,
                    "charizard": { name: "charizard" } as any
                };

                await pokedexCmd.callback(state);

                expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("pikachu"));
                expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("mew"));
                expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("charizard"));
            });
        });

        describe("catch logic", () => {
            test("catch should add pokemon to pokedex on success", async () => {
                const catchCmd = state.commands["catch"];

                const apiSpy = vi.spyOn(state.pokeAPI, "fetchPokemon").mockResolvedValue({
                    name: "pikachu",
                    height: 4,
                    weight: 60,
                    base_experience: 112,
                    stats: { hp: 35, attack: 55 },
                    types: ["electric"]
                } as any);

                vi.spyOn(Math, "random").mockReturnValue(0.9);

                await catchCmd.callback(state, "pikachu");

                expect(state.usersPokedex).toHaveProperty("pikachu");
                expect(state.usersPokedex["pikachu"].name).toBe("pikachu");
            });

            test("catch should NOT add pokemon to pokedex on failure", async () => {
                const catchCmd = state.commands["catch"];

                vi.spyOn(Math, "random").mockReturnValue(0.1);

                await catchCmd.callback(state, "pikachu");

                expect(state.usersPokedex).not.toHaveProperty("pikachu");
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining("escaped"));

            });
        });

        describe("inspect logic", () => {
            test("inspect should fail gracefully if pokemon is not caught", async () => {
                const inspectCmd = state.commands["inspect"];
                state.usersPokedex = {};

                await inspectCmd.callback(state, "mewtwo");

                expect(console.log).toHaveBeenCalledWith(
                    expect.stringContaining("You have not caught mewtwo.")
                );
            });
        });

    });


    describe("Navigation Logic (map / mapb)", () => {
        test("map and mapb should correctly update the state variables using mocks", async () => {
            const mapCmd = state.commands["map"];
            const mapbCmd = state.commands["mapb"];
            const apiSpy = vi.spyOn(state.pokeAPI, "fetchLocations");

            expect(state.nextLocationsURL).toBeNull();
            expect(state.previousLocationsURL).toBeNull();

            //page 2 mock response
            apiSpy.mockResolvedValueOnce({
                next: "offset=20",
                previous: null,
                results: []
            } as any);

            await mapCmd.callback(state);
            expect(state.nextLocationsURL).toBe("offset=20");
            expect(state.previousLocationsURL).toBeNull();

            //page 3 mock response
            apiSpy.mockResolvedValueOnce({
                next: "offset=40",
                previous: "offset=0",
                results: []
            } as any);

            await mapCmd.callback(state);
            expect(state.nextLocationsURL).toBe("offset=40");
            expect(state.previousLocationsURL).toBe("offset=0");

            //back to page 2 mock response
            apiSpy.mockResolvedValueOnce({
                next: "offset=20",
                previous: null,
                results: []
            } as any);

            await mapbCmd.callback(state);
            expect(state.nextLocationsURL).toBe("offset=20");
            expect(state.previousLocationsURL).toBeNull()
        });
    });


    describe("system domain", () => {
        describe("Help command", () => {
            test("should list all available commands", async () => {
                const helpCmd = state.commands["help"];

                await helpCmd.callback(state);
                const commandName = Object.keys(state.commands);
                commandName.forEach(name => {
                    expect(console.log).toHaveBeenCalledWith(
                        expect.stringContaining(name)
                    );
                });
            });
        });

        describe("Exit command", () => {
            test("exit command should attempt to close the process", async () => {
                const exitCmd = state.commands["exit"];

                //create fake repl server
                const mockRepl = {
                    close: vi.fn()
                };

                //inject the server into the state
                state.replServer = mockRepl as any;

                await exitCmd.callback(state);

                //check if command tried to execute
                expect(mockRepl.close).toHaveBeenCalled();

                expect(console.log).toHaveBeenCalledWith(
                    expect.stringContaining("Goodbye")
                );
            });
        });

    });

});
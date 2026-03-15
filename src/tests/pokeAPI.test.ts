import { PokeApi } from "../pokeAPI.js";
import { describe, expect, test, vi } from "vitest";

describe("PokeApi", () => {
    const api = new PokeApi(5000);

    describe("fetchPokemon", () => {
        test("should return a correctly formatted Pokemon object", async () => {
            const pokemon = await api.fetchPokemon("pikachu");

            expect(pokemon.name).toBe("pikachu");
            expect(pokemon).toHaveProperty("height");
            expect(pokemon).toHaveProperty("weight");
            expect(Array.isArray(pokemon.types)).toBe(true);
        });

        test("should correctly map stats to a record object", async () => {
            const pokemon = await api.fetchPokemon("bulbasaur");

            expect(pokemon.stats).toHaveProperty("hp");
            expect(typeof pokemon.stats.hp).toBe("number");
        });
    })

    describe("fetchLocations", () => {
        test("should handle pagination URLs correctly", async () => {
            const nextUrl = "https://pokeapi.co/api/v2/location-area?offset=20&limit=20";

            const data = await api.fetchLocations(nextUrl);

            expect(data.results).toHaveLength(20);
            expect(data.previous).toContain("offset=0");
        });
    })

    describe("fetchEncounters", () => {
        test("fetchEncounters returns a list of pokemon for an area", async () => {
            const data = await api.fetchEncounters("pastoria-city-area");

            expect(Array.isArray(data.pokemon_encounters)).toBe(true);
            if (data.pokemon_encounters.length > 0) {
                expect(data.pokemon_encounters[0].pokemon).toHaveProperty("name");
            }
        });
    });



    describe("Error Handling", () => {
        test("should throw when the network fails", async () => {
            const api = new PokeApi(5000);

            const networkError = new TypeError("Failed to fetch");
            vi.stubGlobal("fetch", vi.fn(() => Promise.reject(networkError)));

            await expect(api.fetchPokemon("pikachu"))
                .rejects
                .toThrow("Failed to fetch");

            vi.unstubAllGlobals();
        });

        //case for 500 is enough, cause we handle 400 status the same way
        test("should throw an error for status 500", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                })

            ));

            await expect(api.fetchPokemon("missingno"))
                .rejects
                .toThrow("Response status: 500");

            vi.unstubAllGlobals();
        });
    });



    describe("Caching & Performance", () => {

        test("should return data from cache on second call (no fetch)", async () => {
            const api = new PokeApi(60000);
            const fetchSpy = vi.spyOn(global, "fetch");

            await api.fetchPokemon("pikachu");
            expect(fetchSpy).toHaveBeenCalledTimes(1);

            await api.fetchPokemon("pikachu");
            expect(fetchSpy).toHaveBeenCalledTimes(1);

            fetchSpy.mockRestore();
        });

        test("should expire old data and trigger a new fetch", async () => {
            vi.useFakeTimers();
            const interval = 1000;
            const api = new PokeApi(interval);
            const fetchSpy = vi.spyOn(global, "fetch");

            await api.fetchPokemon("bulbasaur");
            expect(fetchSpy).toHaveBeenCalledTimes(1);

            vi.advanceTimersByTime(2000);

            await api.fetchPokemon("bulbasaur");
            expect(fetchSpy).toHaveBeenCalledTimes(2);

            vi.useRealTimers();
            fetchSpy.mockRestore();
        });
    });
});


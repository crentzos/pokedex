import { threadCpuUsage } from "node:process";
import { Cache } from "./pokecache.js"
export class PokeApi {
    private static readonly baseURL = "https://pokeapi.co/api/v2";
    private cache: Cache;

    constructor(interval: number) {
        this.cache = new Cache(interval);
    }



    async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
        const url = pageURL || `${PokeApi.baseURL}/location-area`;
        const cacheData = this.cache.get(url);
        if (cacheData) {
            return cacheData as ShallowLocations;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            this.cache.add(url, result);
            return result as ShallowLocations;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async fetchEncounters(name: string) {
        const url = `${PokeApi.baseURL}/location-area/${name}`;
        const cacheData = this.cache.get(url);
        if (cacheData) {
            return cacheData as Location;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            this.cache.add(url, result);
            return result as Location;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async fetchPokemon(pokemonName: string) {
        const url = `${PokeApi.baseURL}/pokemon/${pokemonName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            return {
                name: data.name,
                height: data.height,
                weight: data.weight,
                base_experience: data.base_experience,
                types: data.types.map((t: any) => t.type.name),
                stats: Object.fromEntries(
                    data.stats.map((s: any) => [s.stat.name, s.base_stat])
                )
            } as Pokemon;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}



export type ShallowLocations = {
    count: number,
    next: string | null,
    previous: string | null,
    results: {
        name: string,
        url: string,
    }[],
}


export type Location = {
    id: number;
    name: string;
    pokemon_encounters: {
        pokemon: {
            name: string;
            url: string;
        };
    }[]
}

export type Pokemon = {
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    stats: Record<string, number>;
    types: string[];
}
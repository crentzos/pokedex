import { Pokemon } from "./pokeAPI";

export interface UserProfile {
    passId: string;
    name: string;
    dob: string;
    gender: string;
}

export interface UserData {
    profile: UserProfile;
    pokedex: Record<string, Pokemon>;
    lastLocationURL: string | null;
}


export class User {
    private userData: UserData;

    constructor(profile: UserProfile, initialPokedex = {}, initialLocation: string | null = null) {
        this.userData = {
            profile,
            pokedex: initialPokedex,
            lastLocationURL: initialLocation,
        };
    };

    get profile(): UserProfile {
        return this.userData.profile;
    }

    get pokedex(): Record<string, Pokemon> {
        return this.userData.pokedex;
    }

    get lastLocation(): string | null {
        return this.userData.lastLocationURL;
    }

    addPokemon(name: string, pokemon: Pokemon): void {
        this.userData.pokedex[name.toLowerCase()] = pokemon;
    }

    toJSON(): string {
        return JSON.stringify(this.userData, null, 2);
    }
}
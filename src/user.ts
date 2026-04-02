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
    private _userData: UserData;

    constructor(profile: UserProfile, initialPokedex: Record<string, Pokemon> = {}, initialLocation: string | null = null) {
        this._userData = {
            profile,
            pokedex: initialPokedex,
            lastLocationURL: initialLocation,
        };
    };


    get profile(): UserProfile {
        return this._userData.profile;
    }

    get pokedex(): Record<string, Pokemon> {
        return this._userData.pokedex;
    }

    get lastLocationURL(): string | null {
        return this._userData.lastLocationURL;
    }

    get userData(): UserData {
        return this._userData;
    }

    addPokemon(name: string, pokemon: Pokemon): boolean {
        const key = name.toLowerCase();

        if (this._userData.pokedex[key]) {
            console.log(`You have already caught ${name}.`);
            return false;
        }
        this._userData.pokedex[name.toLowerCase()] = pokemon;
        return true;
    }

    toJSON(): string {
        return JSON.stringify(this._userData, null, 2);
    }
}
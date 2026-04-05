import { Pokemon } from "./pokeAPI";


export interface UserProfile {
    passId: string;
    name: string;
    dob: string;
    gender: string;

}

export interface Inventory {
    pokeballs: number,
    greatballs: number,
    ultraballs: number,
    masterballs: number,
}

export interface GatchaState {
    lastRollDate: string | null;
    rollsToday: number;
}

export interface UserData {
    profile: UserProfile;
    pokedex: Record<string, Pokemon>;
    lastLocationURL: string | null;
    team: string[];
    inventory: Inventory;
    gatcha: GatchaState;
}


export class User {
    private _userData: UserData;

    constructor(profile: UserProfile, initialPokedex: Record<string, Pokemon> = {}, initialLocation: string | null = null, initialTeam: string[] = [], inventory?: Inventory, gatcha?: GatchaState) {
        this._userData = {
            profile,
            pokedex: initialPokedex,
            lastLocationURL: initialLocation,
            team: initialTeam,
            inventory: inventory || {
                pokeballs: 5,
                greatballs: 0,
                ultraballs: 0,
                masterballs: 0,
            },
            gatcha: gatcha || {
                lastRollDate: null,
                rollsToday: 0
            }
        };
    };

    private getToday(): string {
        return new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '-');
    }


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

    get team(): string[] {
        return this._userData.team;
    }

    set lastLocationURL(url: string | null) {
        this._userData.lastLocationURL = url;
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

    addMember(name: string) {
        const key = name.toLocaleLowerCase();

        if (!this._userData.pokedex[key]) return "NOT_CAUGHT";
        if (this._userData.team.includes(key)) return "ALREADY_IN_TEAM";
        if (this._userData.team.length >= 5) return "TEAM_FULL";

        this._userData.team.push(key);
        return "SUCCESS";
    }

    removeMember(name: string): boolean {
        const key = name.toLowerCase();
        const index = this._userData.team.indexOf(key);

        if (index === -1) return false;

        this._userData.team.splice(index, 1);
        return true;
    }

    canRoll(): boolean {
        const today = this.getToday();
        if (this._userData.gatcha.lastRollDate !== today) {
            return true;
        }
        return this._userData.gatcha.rollsToday < 3;
    }

    resetGachaIfNewDay() {
        const today = this.getToday();
        if (this._userData.gatcha.lastRollDate !== today) {
            this._userData.gatcha.lastRollDate = today;
            this._userData.gatcha.rollsToday = 0;
        }
    }

    toJSON(): string {
        return JSON.stringify(this._userData, null, 2);
    }
}
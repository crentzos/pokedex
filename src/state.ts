import { PokeApi, Pokemon } from "./pokeAPI.js";
import { CLICommand, getCommands } from "./commandsRegistry.js";
import { REPLServer } from "node:repl";
import { User, UserProfile } from "./user.js";

export type InterviewState = {
    pendingProfile: Partial<UserProfile>;
    step: number;
};

export interface BattleState {
    enemy: Pokemon;
    enemyHP: number;
    playerTeamHP: Record<string, number>;
    activePokemonName: string;
    fainted: boolean;
    isPlayerFaster: boolean;
}


export type State = {
    commands: Record<string, CLICommand>;
    pokeAPI: PokeApi;
    nextLocationsURL: string | null;
    previousLocationsURL: string | null;
    usersPokedex: Record<string, Pokemon>;
    replServer: REPLServer | null;
    currentUser: User | null;
    interview: InterviewState | null;
    activeBattle: BattleState | null;
};

export function initState() {
    const pokeAPI = new PokeApi(20000);

    return {
        commands: getCommands(),
        pokeAPI,
        nextLocationsURL: null,
        previousLocationsURL: null,
        usersPokedex: {},
        replServer: null,
    }
}
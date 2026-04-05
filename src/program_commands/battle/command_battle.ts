import { State } from "../../state";
import { capitalize } from "../../utilities";
import { getStats } from "./battle_helper";

export async function commandBattle(state: State, ...args: string[]): Promise<void> {
    if (!state.currentUser || state.currentUser.team.length === 0) {
        console.log("Login and ensure your team is not empty.");
        return;
    }

    const name = args[0]?.toLowerCase();
    if (!name) return console.log("Specify a Pokemon to battle.");

    try {
        const enemy = await state.pokeAPI.fetchPokemon(name);
        const teamHP: Record<string, number> = {};
        state.currentUser.team.forEach(n => teamHP[n] = state.currentUser!.pokedex[n].stats["hp"]);

        state.activeBattle = {
            enemy,
            enemyHP: enemy.stats["hp"],
            playerTeamHP: teamHP,
            activePokemonName: state.currentUser.team[0],
            fainted: false,
            isPlayerFaster: false
        };

        const stats = getStats(state);
        state.activeBattle.isPlayerFaster = stats.playerSpeed >= stats.enemySpeed;

        console.log(`A wild ${capitalize(enemy.name)} appeared! Go, ${capitalize(state.activeBattle.activePokemonName)}!`);
    } catch {
        console.log("Pokemon not found.");
    }
}
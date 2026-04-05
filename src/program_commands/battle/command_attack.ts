import { State } from "../../state";
import { capitalize } from "../../utilities";
import { executeTurn, getStats, logStatus } from "./battle_helper"

export async function commandAttack(state: State): Promise<void> {
    const battle = state.activeBattle;
    if (!battle) return;

    if (battle.playerTeamHP[battle.activePokemonName] <= 0) {
        console.log(`${capitalize(battle.activePokemonName)} is fainted! Switch to another Pokemon.`);
        return;
    }

    const { playerAtk, playerDef, enemyAtk, enemyDef } = getStats(state);
    console.log(`\n--- ${capitalize(battle.activePokemonName)} vs ${capitalize(battle.enemy.name)} ---`);

    if (battle.isPlayerFaster) {
        if (!executeTurn("player", playerAtk, enemyDef, state)) {
            executeTurn("enemy", enemyAtk, playerDef, state);
        }
    } else {
        if (!executeTurn("enemy", enemyAtk, playerDef, state)) {
            executeTurn("player", playerAtk, enemyDef, state);
        }
    }
    logStatus(state);
}
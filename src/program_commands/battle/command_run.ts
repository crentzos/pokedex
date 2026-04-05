import { capitalize } from "src/utilities";
import { State } from "../../state";
import { executeTurn } from "./battle_helper";

export async function commandRun(state: State): Promise<void> {
    const battle = state.activeBattle;
    if (!battle) return;

    const playerPokemon = state.currentUser!.pokedex[battle.activePokemonName];
    const playerSpeed = playerPokemon.stats["speed"];
    const enemySpeed = battle.enemy.stats["speed"];

    console.log(`Attempting to flee from ${capitalize(battle.enemy.name)}...`);

    let success = false;
    if (playerSpeed >= enemySpeed) {
        success = true;
    } else {
        success = Math.random() > 0.5;
    }


    if (success) {
        console.log("Got away safely!");
        state.activeBattle = null;
    } else {
        console.log(`Can't escape! The wild ${capitalize(battle.enemy.name)} blocked your path!`);

        const playerDef = playerPokemon.stats["defense"];
        const enemyAtk = battle.enemy.stats["attack"];

        executeTurn("enemy", enemyAtk, playerDef, state);

        if (state.activeBattle) {
            console.log(`Status: ${capitalize(battle.activePokemonName)} (${battle.playerTeamHP[battle.activePokemonName]} HP)`);
        }
    }
}
import { State, BattleState } from "../../state";
import { capitalize } from "../../utilities";

export function getStats(state: State) {
    const battle = state.activeBattle!;
    const playerPokemon = state.currentUser!.pokedex[battle.activePokemonName];

    return {
        playerAtk: playerPokemon.stats["attack"],
        playerDef: playerPokemon.stats["defense"],
        playerSpeed: playerPokemon.stats["speed"],
        enemyAtk: battle.enemy.stats["attack"],
        enemyDef: battle.enemy.stats["defense"],
        enemySpeed: battle.enemy.stats["speed"]
    };
}

export function executeTurn(attacker: "player" | "enemy", atk: number, def: number, state: State): boolean {
    const battle = state.activeBattle!;
    const damage = Math.max(1, Math.floor((atk / def) * 10) + Math.floor(Math.random() * 5));

    if (attacker === "player") {
        battle.enemyHP -= damage;
        console.log(`Your ${capitalize(battle.activePokemonName)} dealt ${damage} damage to wild ${capitalize(battle.enemy.name)}`);
        if (battle.enemyHP <= 0) {
            console.log(`The wild ${capitalize(battle.enemy.name)} fainted! You win!`);
            state.activeBattle = null;
            return true;
        }
    } else {
        battle.playerTeamHP[battle.activePokemonName] -= damage;
        console.log(`Wild ${capitalize(battle.enemy.name)} dealt ${damage} damage!`);
        if (battle.playerTeamHP[battle.activePokemonName] <= 0) {
            battle.playerTeamHP[battle.activePokemonName] = 0;
            console.log(`Your ${capitalize(battle.activePokemonName)} fainted!`);
            const hasSurvivors = Object.values(battle.playerTeamHP).some(hp => hp > 0);
            if (!hasSurvivors) {
                console.log("Your whole team has fainted! You blacked out and exited battle...");
                state.activeBattle = null;
            }
            return true;
        }
    }
    return false;
}

export function logStatus(state: State) {
    if (!state.activeBattle) return;
    const b = state.activeBattle;
    console.log(`Status: ${capitalize(b.activePokemonName)} (${b.playerTeamHP[b.activePokemonName]} HP) | ${capitalize(b.enemy.name)} (${b.enemyHP} HP)`);
}


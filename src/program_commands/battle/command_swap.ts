import { capitalize } from "../../utilities";
import { State } from "../../state";
import { executeTurn } from "./battle_helper";

export async function commandSwap(state: State, ...args: string[]): Promise<void> {
    const battle = state.activeBattle;
    if (!battle) return;

    const team = state.currentUser!.team;
    const oldPokemonName = battle.activePokemonName;
    const newPokemonName = args[0]?.toLowerCase();

    if (!newPokemonName) {
        console.log("Select a pokemon that has not fainted:");
        team.forEach(name => {
            const hp = battle.playerTeamHP[name];
            const status = hp > 0 ? "Healthy" : "FAINTED";
            const active = name === battle.activePokemonName ? "(Active)" : "";
            console.log(`${capitalize(name)}: ${hp} HP [${status}] ${active}`);
        });
        console.log("Please specify which Pokemon from your team want to swap in. (swap <new-pokemon-name>)");
        return;
    }


    if (!team.includes(newPokemonName)) {
        console.log(`${capitalize(newPokemonName)} is not in your current team!`);
        return;
    }

    if (newPokemonName === battle.activePokemonName) {
        console.log(`${capitalize(newPokemonName)} is already on the field!`);
        return;
    }

    if (battle.playerTeamHP[newPokemonName] <= 0) {
        console.log(`${capitalize(newPokemonName)} has fainted and cannot fight!`);
        return;
    }


    battle.activePokemonName = newPokemonName;

    const newPokeData = state.currentUser!.pokedex[newPokemonName];
    battle.isPlayerFaster = newPokeData.stats["speed"] >= battle.enemy.stats["speed"];


    console.log(`${capitalize(oldPokemonName)} come back! Go, ${capitalize(newPokemonName)}!`);

    executeTurn("enemy", battle.enemy.stats["attack"], newPokeData.stats["defense"], state);

    if (state.activeBattle) {
        const currentHP = state.activeBattle.playerTeamHP[newPokemonName];
        if (currentHP > 0) {
            console.log(`\nStatus: ${capitalize(newPokemonName)} (${currentHP} HP) | Wild ${capitalize(battle.enemy.name)} (${battle.enemyHP} HP)`);
        } else {
            console.log("Your new Pokemon fainted immediately! Choose another!");
        }
    }
}
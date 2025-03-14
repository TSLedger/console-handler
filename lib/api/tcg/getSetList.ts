import { PokemonTCG } from '../../../deps.ts';
import type { Choice } from '../../interface/prompt.ts';

export async function getSetList(): Promise<Choice[]> {
  const sets = await PokemonTCG.getAllSets();
  return sets.map((v) => {
    return {
      title: `${v.name} (${v.id})`,
      value: v.id,
    };
  });
}

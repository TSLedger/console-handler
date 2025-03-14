import { prompts } from './deps.ts';
import { tcg } from './lib/api/tcg.ts';
import { getSetList } from './lib/api/tcg/getSetList.ts';
import { tcgdex } from './lib/api/tcgdex.ts';
import { request } from './lib/graphql.ts';
import type { Choice } from './lib/interface/prompt.ts';
import type { Sets } from './lib/interface/response.ts';

// Select the API
const apiprompt = await prompts({
  type: 'select',
  name: 'api',
  message: 'Select the API to Search',
  choices: [
    { title: 'PokemonTCG (Physical)', value: 'tcg' },
    { title: 'TCGDex (Pocket)', value: 'tcgdex' },
  ],
}) as {
  api: string;
};
if (apiprompt.api === null || apiprompt.api.length === 0) {
  throw new Deno.errors.InvalidData('The api to sequence with must be specified.');
}

// Dynamically Generate Sets
const sets: Choice[] = [];
switch (apiprompt.api) {
  case 'tcg': {
    (await getSetList()).reverse().forEach((v) => sets.push(v));
    break;
  }
  case 'tcgdex': {
    const qsets = await request<Sets>('get-sets');
    qsets.sets.reverse().filter((v) => {
      return ['P-A', 'A1', 'A1a', 'A2', 'A2a'].includes(v.id);
    }).forEach((v) => {
      sets.push({ title: `${v.name} (${v.id})`, value: v.id });
    });
    break;
  }
}

// Get the Sets to Sequence
const prompt = await prompts({
  type: 'multiselect',
  name: 'set',
  message: 'Choose the TCG Sets to Sequence',
  choices: sets,
  initial: 0,
}) as {
  set: string[];
};
if (prompt.set === null || prompt.set.length === 0) {
  throw new Deno.errors.InvalidData('The set to sequence must be specified.');
}

switch (apiprompt.api) {
  case 'tcg': {
    tcg(prompt.set);
    break;
  }
  case 'tcgdex': {
    tcgdex(prompt.set);
    break;
  }
}

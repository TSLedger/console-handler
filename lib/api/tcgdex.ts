import { request } from '../graphql.ts';
import type { Cards } from '../interface/response.ts';
import { TSV } from '../util/tsv.ts';

export async function tcgdex(sets: string[]): Promise<void> {
  const qcards = await request<Cards>('get-cards');
  const requested = qcards.cards.filter((card) => {
    return sets.includes(card.set.id);
  });
  const formatted = requested.map((v) => {
    // Generate
    return [v.id, v.name, v.set.id, v.localId, v.set.name, v.image];
  });
  TSV.write(new URL('../../tcgdex.tcg.txt', import.meta.url), formatted);
}

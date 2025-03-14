import { PokemonTCG } from '../../../deps.ts';

export async function getCardFromMultiSet(ids: string[]): Promise<PokemonTCG.Card[]> {
  const cards: PokemonTCG.Card[] = [];
  for (const id of ids) {
    cards.push(...await getCardListFromSet(id));
  }
  return cards;
}

export async function getCardListFromSet(id: string): Promise<PokemonTCG.Card[]> {
  const set = await PokemonTCG.findSetByID(id);
  const cards: PokemonTCG.Card[] = [];

  // Paginate
  for (let i = 1; i <= Math.ceil(set.total / 250); i++) {
    const cardsFromPage = await PokemonTCG.findCardsByQueries({ q: `set.id:${id}`, orderBy: 'number', pageSize: 250, page: i });
    cards.push(...cardsFromPage);
  }

  return cards;
}

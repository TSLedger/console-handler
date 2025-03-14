import { TSV } from '../util/tsv.ts';
import { getCardFromMultiSet } from './tcg/getCardListFromSet.ts';

export async function tcg(sets: string[]): Promise<void> {
  const qcards = await getCardFromMultiSet(sets);
  const formatted = qcards.map((v) => {
    const variants: string[] = [];

    if (v.set.ptcgoCode === undefined) {
      switch (v.set.id) {
        case 'sv3pt5': {
          v.set.ptcgoCode = 'MEW';
          break;
        }
      }
    }

    // Register Variants from TCGPlayer
    if (v.tcgplayer?.prices?.normal) {
      variants.push('Standard');
    }
    if (v.tcgplayer?.prices?.holofoil) {
      variants.push('Foil');
    }
    if (v.tcgplayer?.prices?.reverseHolofoil) {
      variants.push('Reverse');
    }

    // Generate
    return [v.id, v.name, v.set.id, v.number, v.set.name, v.set.ptcgoCode, variants.join(', ')];
  });
  const prices = qcards.map((v) => {
    const price = {
      normal: {
        market: '=NA()',
      },
      holofoil: {
        market: '=NA()',
      },
      reverseHolofoil: {
        market: '=NA()',
      },
    } as {
      [key: string]: {
        market: number | '=NA()';
      };
    };
    if (v.tcgplayer?.prices?.normal) {
      price['normal']!.market = v.tcgplayer.prices.normal.market ?? '=NA()';
    }
    if (v.tcgplayer?.prices?.holofoil) {
      price['holofoil']!.market = v.tcgplayer.prices.holofoil.market ?? '=NA()';
    }
    if (v.tcgplayer?.prices?.reverseHolofoil) {
      price['reverseHolofoil']!.market = v.tcgplayer.prices.reverseHolofoil.market ?? '=NA()';
    }
    return [v.id, price['normal']!.market, price['holofoil']!.market, price['reverseHolofoil']!.market];
  });
  TSV.write(new URL('../../tcgdex.tcg.txt', import.meta.url), formatted);
  TSV.write(new URL('../../tcgdex.price.txt', import.meta.url), prices as string[][]);
}

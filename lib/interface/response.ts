export interface Sets {
  sets: Set[];
}

export interface Set {
  id: string;
  name: string;
  logo: string;
  serie: {
    id: string;
    name: string;
  };
  cardCount: {
    official: number;
    total: number;
  };
}

export interface Cards {
  cards: Card[];
}

export interface Card {
  id: string;
  name: string;
  set: {
    id: string;
    name: string;
  };
  localId: string;
  variants: {
    holo: boolean;
    normal: boolean;
    reverse: boolean;
  };
  image: string;
}

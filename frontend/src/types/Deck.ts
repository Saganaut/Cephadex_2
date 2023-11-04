export interface SharedDecks {
  id: number;
  name: string;
  description: string | null;
  sender: number | null;
  receiver: number | null;
  "time-created": string;
  creator: string;
  public: boolean;
  edited: boolean;
  "share-id": number;
}

export interface DeckFiles {
  id: number;
  "file-name": string;
  "file-path": string | null;
  "file-type": string | null;
  "file-size": number | null;
  "create-type": string | null;
  "time-created": string;
  fav: boolean | null;
}

export interface DeckAttributes {
  id: number;
  "deck-id": number;
  subject: string | null;
  grade: string | null;
  topic: string | null;
  "sub-topic": string | null;
  difficult: string | null;
  concepts: string | null;
  "time-created": string;
  language: string | null;
}
export interface Deck {
  id: number;
  name: string;
  description: string | null;
  "user-id": number | null;
  "qty-cards": number;
  "qty-cards-due": number;
  "time-created": string;
  "time-updated": string;
  creator: number;
  public: boolean;
  edited: boolean;
  "create-method": string | null;
  category: string | null;
  "times-accessed": number | null;
  "access-date": string | null;
  subject: string | null;
  topic: string | null;
  shared: boolean;
  accepted: boolean;
  sharer: number | null;
  source: string | null;
  "share-date": string | null;
  "share-id": number | null;
  fav: boolean | null;
}

export interface DeckPublic {
  id: number;
  name: string;
  description: string | null;
  "user-id": number | null;
  creator: number | null;
  public: boolean;
  category: string | null;
  subject: string | null;
  topic: string | null;
}

export interface Card {
  id: number;
  term: string;
  content: string;
  "boc-2": string | null;
  "boc-3": string | null;
  "boc-4": string | null;
  formula: string | null;
  img: string | null;
  sound: string | null;
  "boc-id": number | null;
  "box-id": number | null;
  "srs-interval": number | null;
  "time-updated": string | null;
  "times-asked": number;
  "times-correct": number;
  "times-correct-row": number;
  "create-method": string | null;
  category: string | null;
  edited: boolean;
  "diff-lvl": number;
  subject: string | null;
  topic: string | null;
  "prompt-option": string | null;
  "prompt-option2": string | null;
  "trans-option": string | null;
  "len-option": number;
  "qmin-option": number;
  "qmax-option": number;
  fav: boolean;
  "time-created": string;
}

export interface CardPublic {
  id: number;
  term: string;
  content: string;
  "boc-2": string | null;
  "boc-3": string | null;
  "boc-4": string | null;
  formula: string | null;
  img: string | null;
  sound: string | null;
  category: string | null;
  "diff-lvl": number;
  subject: string | null;
  topic: string | null;
}

export interface PlayerGame {
  id: number;
  "player-id": number;
  username: string;
  "game-id": number;
  score: number | null;
  "turns-as-main-player": number | null;
  points: number;
}

export interface Game {
  id: number;
  creator: number;
  "current-flashcard-id": number;
  "deck-id": number;
  rounds: number;
  "time-limit": number;
  "time-created": string;
  "start-time": string;
  "current-round": number;
}

export interface GameVote {
  id: number;
  "answer-id": number;
  "user-id": number;
  round: number;
  "game-id": number;
}

export interface GameAnswer {
  id: number;
  text: string;
  "game-id": number;
  round: number;
  "user-id": number;
  "is-correct": boolean;
}

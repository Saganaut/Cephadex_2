/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameQuestionSchema } from './GameQuestionSchema';
import type { GameStatus } from './GameStatus';
import type { PlayerGameSchema } from './PlayerGameSchema';

export type GameSchema = {
    id: number;
    creator: number;
    creatorUsername: string;
    currentQuestion: (GameQuestionSchema | null);
    deckId: number;
    rounds: number;
    timeLimitAnswer: number;
    timeCreated: (string | null);
    startTime: (string | null);
    currentRound: number;
    players: Array<PlayerGameSchema>;
    pointsCorrect?: number;
    pointsDeceiver?: number;
    timeLimitVote?: number;
    status?: GameStatus;
    askedQuestions?: Array<number>;
    host: number;
    hostUsername: string;
    gameType: string;
};


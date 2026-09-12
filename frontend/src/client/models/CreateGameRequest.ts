/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateGameRequest = {
    deckId: number;
    gameType?: string;
    rounds?: (number | null);
    timeLimitAnswer: (number | null);
    timeLimitVote: (number | null);
    participate?: boolean;
    pointsCorrect?: number;
    pointsDeceiver?: number;
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnsweredCardData } from './AnsweredCardData';

export type GetCardsDueRequest = {
    deckId: number;
    batchNumber: (number | null);
    cards: (Array<AnsweredCardData> | null);
    settings: (Record<string, number> | null);
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameTypes } from './GameTypes';
import type { McqAnswer } from './McqAnswer';

export type GameQuestionSchema = {
    type: GameTypes;
    cardId: number;
    deckId: (number | null);
    question: string;
    answer: (string | McqAnswer | null);
    questionCategory: string;
    img: (string | null);
    sound: (string | null);
    isCorrectAnswer?: boolean;
};


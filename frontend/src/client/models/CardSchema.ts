/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardType } from './CardType';
import type { Language } from './Language';

export type CardSchema = {
    id: number;
    term: string;
    content: (string | null);
    boc2: (string | null);
    boc3: (string | null);
    boc4: (string | null);
    formula: (string | null);
    img: (string | null);
    sound: (string | null);
    bocId?: (number | null);
    boxId?: (number | null);
    createMethod?: (string | null);
    diffLvl: number;
    subject: (string | null);
    topic?: (string | null);
    customFront: (string | null);
    customBack: (string | null);
    language: (Language | null);
    lenOption?: (string | null);
    qminOption?: (string | null);
    qmaxOption?: (string | null);
    category: (CardType | string);
    deckId?: (number | null);
    srsInterval: number;
    timeUpdated: (string | null);
    timesAsked: number;
    timesCorrect: number;
    timesCorrectRow: number;
    timeCreated: string;
    edited: boolean;
    fav: boolean;
    shareId?: (string | null);
};


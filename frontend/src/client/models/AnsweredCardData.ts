/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AnsweredCardData = {
    cardId: number;
    /**
     * one of 'incr', 'decr', 'skip', 'easy', 'hard'
     */
    action: string;
    uniqueId: (number | null);
    answer?: (string | null);
};


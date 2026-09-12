/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SharedDeckSchema = {
    id: number;
    userId: (number | null);
    userEmail: string;
    deckId: number;
    timeCreated: string;
    shareId: string;
    expire: boolean;
    hoursUntilExpire: number;
    /**
     * user, guest, general
     */
    type: string;
    name?: (string | null);
};


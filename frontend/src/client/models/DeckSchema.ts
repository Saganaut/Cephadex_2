/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DeckSchema = {
    id: number;
    name: string;
    description: (string | null);
    creator: (number | null);
    public?: boolean;
    createMethod?: (string | null);
    category: (string | null);
    subject: (string | null);
    topic: (string | null);
    shareId: (string | null);
    groupId?: (number | null);
    qtyCards: (number | null);
    img: (string | null);
    cards?: (Array<number> | null);
    parents?: (Array<number> | null);
    files?: (Array<number> | null);
    tags: (string | null);
    type?: string;
    group?: (Array<number> | null);
    timeCreated: string;
    timeUpdated: string;
    timesStudied?: number;
    accessDate: (string | null);
    shareDate: (string | null);
    qtyNewCards?: number;
    shared?: boolean;
    accepted?: boolean;
    sharer: (number | null);
    source: (string | null);
    edited?: (number | null);
    children?: (Array<number> | null);
    fav?: boolean;
    qtyCardsLearning: number;
    qtyCardsMastered: number;
    qtyGroups: number;
    qtyFiles: number;
    qtySubdecks: number;
    qtyCardsSeen: number;
    qtyCardsDue: number;
    qtyQuizzes: number;
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PublicDeckSchema = {
    id: number;
    name: string;
    description: (string | null);
    creator?: (number | null);
    public?: boolean;
    createMethod?: (string | null);
    category: (string | null);
    subject: (string | null);
    topic: (string | null);
    shareId?: (string | null);
    groupId?: (number | null);
    qtyCards: (number | null);
    img: (string | null);
    cards?: (Array<number> | null);
    parents?: (Array<number> | null);
    files?: (Array<number> | null);
    tags: (string | null);
    type?: string;
    group?: (Array<number> | null);
    likes: number;
    shares: number;
    views?: number;
    liked?: boolean;
};


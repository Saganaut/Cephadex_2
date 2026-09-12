/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseDeckSchema } from './BaseDeckSchema';
import type { PublicCardSchema } from './PublicCardSchema';

export type GetSharedDeckDataResponse = {
    status: string;
    message: string;
    decks: (Array<BaseDeckSchema> | null);
    cards: (Array<PublicCardSchema> | null);
};


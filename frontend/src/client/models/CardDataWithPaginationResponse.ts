/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardSchema } from './CardSchema';

export type CardDataWithPaginationResponse = {
    status: string;
    message: string;
    cards: (Array<CardSchema> | null);
    pageNumber: number;
    totalPages: number;
};


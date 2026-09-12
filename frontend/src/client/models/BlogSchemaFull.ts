/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ImagesSchema } from './ImagesSchema';

export type BlogSchemaFull = {
    id: number;
    title: string;
    slug: string;
    content: string;
    summary: string;
    authorName?: (string | null);
    tags?: (string | null);
    thumbnail?: (string | null);
    timeCreated: string;
    updated?: (string | null);
    views?: (number | null);
    userId?: (number | null);
    category?: (string | null);
    avatar?: (string | null);
    images?: (Array<ImagesSchema> | null);
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BlogSchemaFull } from './BlogSchemaFull';
import type { ImagesSchema } from './ImagesSchema';

export type BlogDataResponse = {
    status: string;
    message: string;
    blog: Array<BlogSchemaFull>;
    avatar?: (string | null);
    images?: (Array<ImagesSchema> | null);
};


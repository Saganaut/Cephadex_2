/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameSchema } from './GameSchema';

export type NewGameDataResponse = {
    status: string;
    message: string;
    link: (string | null);
    qrCode?: (string | null);
    game: GameSchema;
    round?: (Record<string, any> | null);
};


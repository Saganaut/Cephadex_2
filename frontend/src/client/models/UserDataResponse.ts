/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserSchema } from './UserSchema';
import type { UserSettingsSchema } from './UserSettingsSchema';

export type UserDataResponse = {
    status: string;
    loggedIn: boolean;
    message: string;
    user?: (UserSchema | null);
    settings?: (UserSettingsSchema | null);
};


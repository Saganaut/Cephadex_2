/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserSchema } from './UserSchema';
import type { UserSettingsSchema } from './UserSettingsSchema';

export type SignupResponse = {
    status: string;
    message: string;
    user: UserSchema;
    settings: UserSettingsSchema;
};


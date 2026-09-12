/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { emailInvites } from './emailInvites';
import type { inviteeSchema } from './inviteeSchema';

/**
 * emails: str
 */
export type InviteRequest = {
    invitees?: (Array<inviteeSchema> | null);
    emails?: (Array<emailInvites> | null);
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeckSchema } from './DeckSchema';
import type { GroupInviteSchema } from './GroupInviteSchema';
import type { GroupMemberSchema } from './GroupMemberSchema';
import type { GroupSchemaWithPermissions } from './GroupSchemaWithPermissions';

export type GroupFullSchema = {
    group: GroupSchemaWithPermissions;
    invites?: (Array<GroupInviteSchema> | null);
    members?: (Array<GroupMemberSchema> | null);
    decks?: (Array<DeckSchema> | null);
    invitedEmails?: (Array<string> | null);
};


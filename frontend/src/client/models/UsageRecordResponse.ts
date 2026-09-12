/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsageRecordSchema } from './UsageRecordSchema';

export type UsageRecordResponse = {
    status: string;
    message: string;
    data?: (Record<string, any> | null);
    usageRecords: Array<UsageRecordSchema>;
};


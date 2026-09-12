/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UsageRecordSchema = {
    id: number;
    userId: number;
    operationType: string;
    operationDetails?: (string | null);
    operationCount: number;
    remainingCount: number;
    timePeriod: string;
    limitCount: number;
    date: string;
    status: string;
    sourceIp?: (string | null);
    paymentStatus: string;
    remainingPictures?: (number | null);
    remainingCredit: number;
};


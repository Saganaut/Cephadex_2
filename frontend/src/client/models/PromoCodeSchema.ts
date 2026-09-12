/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PromoCodeSchema = {
    id: number;
    code: string;
    type: string;
    promoType?: (string | null);
    schoolId?: (number | null);
    expirationDate?: (string | null);
    expired: boolean;
    schoolRole?: (string | null);
    timesUsed: number;
    maxUses?: (number | null);
    credits?: (number | null);
};


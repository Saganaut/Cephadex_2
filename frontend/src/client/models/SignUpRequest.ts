/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SignUpRequest = {
    email: string;
    username: string;
    role: string;
    firstName: (string | null);
    lastName?: (string | null);
    token: string;
    picture?: (string | null);
    userTimezone?: (string | null);
    agreeTandC: boolean;
    newsletter: boolean;
    howDidYouHearAboutUs: string;
    whatDoYouWantToDo: string;
    externalType?: string;
    promoCode?: (string | null);
};


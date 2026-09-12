/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type QuizSharingSchema = {
    id: number;
    quizId: number;
    shareId: string;
    hoursUntilExpire: number;
    canRetake: boolean;
    timeCreated: string;
    userEmail?: (string | null);
    userId?: (number | null);
    expire: boolean;
    type: string;
    resultsReported?: boolean;
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type QuizResultSchema = {
    id: number;
    testId: number;
    taker: (number | null);
    creator: (number | null);
    dueDate: (string | null);
    startTime: (string | null);
    endTime: (string | null);
    points?: number;
    correct?: number;
    blank?: number;
    graded?: boolean;
    private?: boolean;
    takerUsername?: (string | null);
    takerName?: (string | null);
    creatorUsername?: (string | null);
};


/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MyQuizResultsResponse } from '../models/MyQuizResultsResponse';
import type { QuizResultsResponseData } from '../models/QuizResultsResponseData';
import type { SingleQuizResultResponse } from '../models/SingleQuizResultResponse';
import type { StandardApiResponse } from '../models/StandardApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ResultService {

    /**
     * Get Quiz Result
     * Both grades a quiz if it is not graded and returns the quiz results
     * not taker returns as a string instead of an int even though it corresponds to an id to allow
     * for "guest" to take the quiz
     * for users other than teh creator of the quiz a user_id should be passed in
     * user_id: /quiz/result/182?user_id=123
     * @param quizResultId
     * @param userId
     * @returns SingleQuizResultResponse Successful Response
     * @throws ApiError
     */
    public static getQuizResult(
        quizResultId: number,
        userId?: (number | null),
    ): CancelablePromise<SingleQuizResultResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/result/{quiz_result_id}/',
            path: {
                'quiz_result_id': quizResultId,
            },
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Quiz Result
     * Deletes a quiz result
     * @param quizResultId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteQuizResult(
        quizResultId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/quiz/result/{quiz_result_id}/',
            path: {
                'quiz_result_id': quizResultId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Assigned Results
     * The results for all quizzes assigned by a user, basically a teachers students results
     * @returns QuizResultsResponseData Successful Response
     * @throws ApiError
     */
    public static getAssignedResults(): CancelablePromise<QuizResultsResponseData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/results/assigned-results',
        });
    }

    /**
     * Get My Results
     * Returns all quizzes taken by a user, results are a list of dicts, each dict has a quiz_name
     * , quiz (quiz.to_dict(), and result (result.to_dict())
     * @returns QuizResultsResponseData Successful Response
     * @throws ApiError
     */
    public static getMyResults(): CancelablePromise<QuizResultsResponseData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/results/my-results',
        });
    }

    /**
     * Get User Results For Quiz
     * @param quizId
     * @returns MyQuizResultsResponse Successful Response
     * @throws ApiError
     */
    public static getUserResultsForQuiz(
        quizId: number,
    ): CancelablePromise<MyQuizResultsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/{quiz_id}/results',
            path: {
                'quiz_id': quizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}

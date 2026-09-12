/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailListRequest } from '../models/EmailListRequest';
import type { IdListRequest } from '../models/IdListRequest';
import type { LinkAndQrCodeResponse } from '../models/LinkAndQrCodeResponse';
import type { MyQuizResultsResponse } from '../models/MyQuizResultsResponse';
import type { NewQuizRequest } from '../models/NewQuizRequest';
import type { QuestionRequestSchema } from '../models/QuestionRequestSchema';
import type { QuestionSchema } from '../models/QuestionSchema';
import type { QuizDataResponse } from '../models/QuizDataResponse';
import type { QuizRequestSchema } from '../models/QuizRequestSchema';
import type { QuizResultDataRequest } from '../models/QuizResultDataRequest';
import type { QuizResultDataResponse } from '../models/QuizResultDataResponse';
import type { QuizResultGradeRequest } from '../models/QuizResultGradeRequest';
import type { QuizResultsResponseData } from '../models/QuizResultsResponseData';
import type { QuizSharedDataResponse } from '../models/QuizSharedDataResponse';
import type { QuizSharingDataResponse } from '../models/QuizSharingDataResponse';
import type { SingleQuizResultResponse } from '../models/SingleQuizResultResponse';
import type { StandardApiResponse } from '../models/StandardApiResponse';
import type { ToggleResponseModel } from '../models/ToggleResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuizService {

    /**
     * Reject Quiz
     * @param quizId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static rejectQuiz(
        quizId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/quiz/assigned/{quiz_id}/',
            path: {
                'quiz_id': quizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Assigned Quizzes
     * DERECATED TO BE REMOVED returns all quizzes ASSIGNED to a user
     * @returns QuizDataResponse Successful Response
     * @throws ApiError
     */
    public static getAssignedQuizzes(): CancelablePromise<QuizDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/assigned',
        });
    }

    /**
     * Assign Quiz
     * @param quizId
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static assignQuiz(
        quizId: number,
        requestBody: EmailListRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz/{quiz_id}/assign',
            path: {
                'quiz_id': quizId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Share Link For Quiz
     * Returns a link and a QR code for a quiz - accessible by anyone
     * @param quizId
     * @returns LinkAndQrCodeResponse Successful Response
     * @throws ApiError
     */
    public static getShareLinkForQuiz(
        quizId: number,
    ): CancelablePromise<LinkAndQrCodeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/{quiz_id}/link',
            path: {
                'quiz_id': quizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Shared Quizzes For User
     * Returns all quizzes ASSIGNED to a user
     * @returns QuizSharingDataResponse Successful Response
     * @throws ApiError
     */
    public static getSharedQuizzesForUser(): CancelablePromise<QuizSharingDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/shared-quizzes',
        });
    }

    /**
     * Delete Shared Quiz
     * @param sharedQuizId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteSharedQuiz(
        sharedQuizId: string,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/quiz/shared-quiz/{shared_quiz_id}',
            path: {
                'shared_quiz_id': sharedQuizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Shared Quiz
     * @param sharedQuizId
     * @returns QuizSharedDataResponse Successful Response
     * @throws ApiError
     */
    public static getSharedQuiz(
        sharedQuizId: string,
    ): CancelablePromise<QuizSharedDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/shared-quiz/{shared_quiz_id}',
            path: {
                'shared_quiz_id': sharedQuizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Shared Quiz And Questions
     * @param sharedQuizId
     * @returns QuizDataResponse Successful Response
     * @throws ApiError
     */
    public static getSharedQuizAndQuestions(
        sharedQuizId: string,
    ): CancelablePromise<QuizDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/shared/{shared_quiz_id}',
            path: {
                'shared_quiz_id': sharedQuizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Created Quizzes
     * Return all quizzes CREATED by a user
     * @returns QuizDataResponse Successful Response
     * @throws ApiError
     */
    public static getAllCreatedQuizzes(): CancelablePromise<QuizDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/created',
        });
    }

    /**
     * Toggle Favorite Quiz
     * Toggles .fav on a quiz
     * @param quizId
     * @returns ToggleResponseModel Successful Response
     * @throws ApiError
     */
    public static toggleFavoriteQuiz(
        quizId: number,
    ): CancelablePromise<ToggleResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz/{quiz_id}/favorite',
            path: {
                'quiz_id': quizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Quiz Question
     * Deletes a question from a quiz - this route still has some issues
     * @param quizId
     * @param questionId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteQuizQuestion(
        quizId: number,
        questionId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/quiz/{quiz_id}/question/{question_id}',
            path: {
                'quiz_id': quizId,
                'question_id': questionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update One Question
     * @param quizId
     * @param questionId
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static updateOneQuestion(
        quizId: number,
        questionId: number,
        requestBody: QuestionSchema,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/quiz/{quiz_id}/question/{question_id}',
            path: {
                'quiz_id': quizId,
                'question_id': questionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Quiz
     * Deletes a quiz
     * @param quizId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteQuiz(
        quizId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/quiz/{quiz_id}',
            path: {
                'quiz_id': quizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Quiz
     * @param quizId
     * @param requestBody
     * @returns QuizDataResponse Successful Response
     * @throws ApiError
     */
    public static updateQuiz(
        quizId: number,
        requestBody: QuizRequestSchema,
    ): CancelablePromise<QuizDataResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/quiz/{quiz_id}',
            path: {
                'quiz_id': quizId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Quiz And Questions
     * @param quizId
     * @returns QuizDataResponse Successful Response
     * @throws ApiError
     */
    public static getQuizAndQuestions(
        quizId: number,
    ): CancelablePromise<QuizDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quiz/{quiz_id}',
            path: {
                'quiz_id': quizId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create New Quiz
     * Creates a new quiz, jeopardy option now moved to front end.  So if jeopardy option is
     * selected
     * then the back of card becomes the question and the front of card becomes the answer.
     * This is not available
     * for MCQ or other types of questions with more than one boc value
     * Only include relevant values for quiz, do not include timeCreated, the db will handle that
     * Make sure that deckId
     * @param requestBody
     * @returns QuizDataResponse Successful Response
     * @throws ApiError
     */
    public static createNewQuiz(
        requestBody: NewQuizRequest,
    ): CancelablePromise<QuizDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz/new',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add Question To Quiz
     * @param quizId
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static addQuestionToQuiz(
        quizId: number,
        requestBody: QuestionRequestSchema,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz/{quiz_id}/question/new',
            path: {
                'quiz_id': quizId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Questions From Quiz
     * @param quizId
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteQuestionsFromQuiz(
        quizId: number,
        requestBody: IdListRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/quiz/{quiz_id}/questions',
            path: {
                'quiz_id': quizId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Take Shared Quiz
     * @param sharedQuizId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static takeSharedQuiz(
        sharedQuizId: string,
        requestBody: QuizResultDataRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz/shared/{shared_quiz_id}/take-quiz',
            path: {
                'shared_quiz_id': sharedQuizId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Take Quiz
     * @param quizId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static takeQuiz(
        quizId: number,
        requestBody: QuizResultDataRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz/{quiz_id}/take-quiz',
            path: {
                'quiz_id': quizId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

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
     * Grade Quiz Manually
     * @param quizId
     * @param resultId
     * @param requestBody
     * @returns QuizResultDataResponse Successful Response
     * @throws ApiError
     */
    public static gradeQuizManually(
        quizId: number,
        resultId: number,
        requestBody: QuizResultGradeRequest,
    ): CancelablePromise<QuizResultDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quiz/{quiz_id}/result/{result_id}/grade',
            path: {
                'quiz_id': quizId,
                'result_id': resultId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
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

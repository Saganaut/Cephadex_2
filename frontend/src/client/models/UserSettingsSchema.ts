/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserSettingsSchema = {
    language: (string | null);
    theme: (string | null);
    newUser: boolean;
    newUserCreate: boolean;
    newUserGroups: boolean;
    newUserPlay: boolean;
    newUserStudy: boolean;
    newUserDecks: boolean;
    newUserTests: boolean;
    newUserCards: boolean;
    newUserCreateQuiz: boolean;
    qtyCardsToLoadBeforeNewCards: number;
    numberOfCardsToLoad: number;
    maxSrsInterval: number;
    box0Multiplier: number;
    box1Multiplier: number;
    box2Multiplier: number;
    box3Multiplier: number;
    qtyCorrectInARowForMovingUpBox: number;
    highestBox: number;
    qtyCorrectInARowForIntervalBonus: number;
    intervalBonusForCorrectInARow: number;
    decrementBox1Multiplier: number;
    decrementBox2Multiplier: number;
    decrementBox3Multiplier: number;
    decrementMinimumSrsInterval: number;
    minimumBoxIdAfterStartingToStudyCard: number;
    tooEasyMultiplier: number;
    tooHardMultiplier: number;
    retrieveWithinMinutes: number;
};


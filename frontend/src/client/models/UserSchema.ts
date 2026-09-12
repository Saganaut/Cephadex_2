/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserSchema = {
    id?: (number | null);
    username?: (string | null);
    email: string;
    firstName: (string | null);
    lastName: (string | null);
    accountType: (string | null);
    accountStatus: (string | null);
    pic: (string | null);
    contactedEmail?: boolean;
    subscriptionPlan?: number;
    role: (string | null);
    guest?: boolean;
    active?: boolean;
    externalId: (string | null);
    externalType: (string | null);
    timeCreated: (string | null);
    timeAccessed?: string;
    accountExpiration: (string | null);
    accountExpirationReason: (string | null);
    subscriptionStartDate?: (string | null);
    subscriptionEndDate?: (string | null);
    latestRollOver?: (string | null);
    stripeCustomerId: (string | null);
    usedTrial?: boolean;
    quantityCardsDue?: (number | null);
    quantityDecks?: (number | null);
    quantityCards?: (number | null);
    quantityQuizzes?: (number | null);
    quantityFiles?: (number | null);
    quantityGroups?: (number | null);
    quantityDecksPublic?: (number | null);
    quantityCardsMastered?: (number | null);
    quantityCardsLearning?: (number | null);
    quantityCardsNew?: (number | null);
    remainingCredit?: (number | null);
    rollOverDate: (string | null);
    subscriber?: (boolean | null);
};


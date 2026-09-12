/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConnectionStatus } from './ConnectionStatus';
import type { PlayerStatus } from './PlayerStatus';

export type PlayerGameSchema = {
    id: string;
    playerId: number;
    username: string;
    gameId: number;
    turnsAsMainPlayer?: number;
    status?: PlayerStatus;
    totalPointsAnswer?: number;
    totalPointsDeceiver?: number;
    totalPoints?: number;
    isHost?: boolean;
    connectionStatus?: ConnectionStatus;
    isPlayer?: boolean;
    gameType?: (string | null);
};


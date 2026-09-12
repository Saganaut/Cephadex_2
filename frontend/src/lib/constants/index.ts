export const GameManagerMessageTypes = {
    NEW_HOST: 'newHost',
    BECOME_HOST: 'becomeHost',
    // TRIGGERED BY THE GAME CREATOR
    START_GAME: 'startGame',
    REQUEST_MESSAGE: 'messageRequest',
    MESSAGE_RESPONSE: 'messageResponse',
    START_ROUND: 'startRound',
    END_GAME: 'endGame',
    END_ANSWERS: 'endAnswers',
    END_VOTES: 'endVotes',
    REMOVE_PLAYER: 'removePlayer',
    // TRIGGERED BY THE PLAYERS
    ANSWER_SUBMITTED: 'answerSubmitted',
    LEAVE_GAME: 'leaveGame',
    VOTE_SUBMITTED: 'voteSubmitted',
    JOINED_PLAYER: 'joinedPlayer',
    SUBMIT_VOTE: 'submitVote',
    SUBMIT_ANSWER: 'submitAnswer',
    ANSWERS_READY: 'answersReady',
    VOTES_COUNTED: 'votesCounted',
    // TRIGGERED BY THE GAME
    ERROR: 'error',
} as const

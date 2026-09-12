import { AccountService } from '@client/services/AccountService'
import type { EditFormValues } from '@common/Modals/EditCardContentModal'
import type { CardSchema, QuestionSchema } from '@source/client'
import { bgColors } from '@source/pages/Game/config'

// import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
// import debounce from "lodash/debounce";
import type { Message } from '../store/chatbotMessages/chatbotMessagesSlice'
import type { TempQuestionSchema } from '../store/tempQuestions/tempQuestionsSlice'

export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffledArray = array.slice()
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ]
    }
    return shuffledArray
}

export function orderByQuestionOrder(
    cards: TempQuestionSchema[],
    questions: TempQuestionSchema[]
): TempQuestionSchema[] {
    // Sort cards based on qOrder in questions
    return cards.sort((cardA, cardB) => {
        const questionA = questions.find((question) => question.id === cardA.id)
        const questionB = questions.find((question) => question.id === cardB.id)

        if (questionA != null && questionB != null) {
            return (questionA.qOrder ?? 0) - (questionB.qOrder ?? 0)
        }

        return 0
    })
}
export function filterAndOrderByQuestionOrder(
    cards: TempQuestionSchema[],
    questions: TempQuestionSchema[]
): TempQuestionSchema[] {
    // Filter cards that have matching ids in questions
    const filteredCards = cards.filter((card) =>
        questions.some((question) => question.id === card.id)
    )

    // Sort filteredCards based on qOrder
    return filteredCards.sort((cardA, cardB) => {
        const questionA = questions.find((question) => question.id === cardA.id)
        const questionB = questions.find((question) => question.id === cardB.id)

        if (questionA != null && questionB != null) {
            return (questionA.qOrder ?? 0) - (questionB.qOrder ?? 0)
        }

        return 0
    })
}

export function findDifferentValues<T extends EditFormValues | null>(
    obj1: T,
    obj2: T
): string[] {
    if (obj1 === null || obj2 === null) return []
    const differentKeys: string[] = []
    for (const key in obj1 as Record<string, any>) {
        if (
            Object.prototype.hasOwnProperty.call(obj1, key) &&
            Object.prototype.hasOwnProperty.call(obj2, key) &&
            obj1?.[key as keyof EditFormValues] !==
                obj2[key as keyof EditFormValues]
        ) {
            differentKeys.push(key)
        }
    }

    return differentKeys
}

function convertLocalToUTC(localDate: Date): Date {
    // Get the time zone offset in minutes
    const offsetMinutes = localDate.getTimezoneOffset()

    // Create a new Date object with the UTC time
    return new Date(localDate.getTime() + offsetMinutes * 60000)
}
export function formatTimeAgo(timestampStr: string): string {
    const timestamp = new Date(timestampStr)

    const now = convertLocalToUTC(new Date())
    const timeDifference = now.getTime() - timestamp.getTime()
    const minutesDifference = Math.floor(timeDifference / (1000 * 60))

    if (minutesDifference === 0) {
        return 'Just now'
    } else if (minutesDifference === 1) {
        return '1 min ago'
    } else if (minutesDifference < 60) {
        return `${minutesDifference} mins ago`
    } else {
        return timestamp.toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }
}

export function getRandomItem<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined
    }
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

const truncate = (str: string, num: number): string => {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
}

function formatDate(dateStr: string, full = false): string {
    const date = new Date(dateStr)
    if (full) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })
    }
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: "numeric",
        // minute: "numeric",
        // hour12: true,
    })
}

export function getLatestBotMessage(messages: Message[]): Message | null {
    let latestBotMessage: Message | null = null

    for (const message of messages) {
        if (message.type === 'bot') {
            // Update the latestBotMessage only if it's null or the current message is more recent
            if (
                latestBotMessage == null ||
                message.timeStamp > latestBotMessage.timeStamp
            ) {
                latestBotMessage = message
            }
        }
    }

    return latestBotMessage
}

function validateEmail(email: string): boolean {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const timeSinceNotification = (date: string): string => {
    const timeCreated = new Date(date).getTime()
    const currentTime = new Date().getTime()
    const timeDifference = currentTime - timeCreated
    const timeDifferenceInSeconds = timeDifference / 1000
    const timeDifferenceInMinutes = timeDifferenceInSeconds / 60
    const timeDifferenceInHours = timeDifferenceInMinutes / 60
    const timeDifferenceInDays = timeDifferenceInHours / 24
    const timeDifferenceInWeeks = timeDifferenceInDays / 7
    const timeDifferenceInMonths = timeDifferenceInWeeks / 4
    const timeDifferenceInYears = timeDifferenceInMonths / 12

    const formatTime = (value: number, unit: string): string => {
        const roundedValue = Math.floor(value)
        const plural = roundedValue === 1 ? '' : 's'
        return `${roundedValue} ${unit}${plural} ago`
    }

    if (timeDifferenceInSeconds < 60) {
        return formatTime(timeDifferenceInSeconds, 'second')
    } else if (timeDifferenceInMinutes < 60) {
        return formatTime(timeDifferenceInMinutes, 'minute')
    } else if (timeDifferenceInHours < 24) {
        return formatTime(timeDifferenceInHours, 'hour')
    } else if (timeDifferenceInDays < 7) {
        return formatTime(timeDifferenceInDays, 'day')
    } else if (timeDifferenceInWeeks < 4) {
        return formatTime(timeDifferenceInWeeks, 'week')
    } else if (timeDifferenceInMonths < 12) {
        return formatTime(timeDifferenceInMonths, 'month')
    } else {
        return formatTime(timeDifferenceInYears, 'year')
    }
}

const checkUsername = async (username: string): Promise<boolean> => {
    try {
        const response = await AccountService.checkUsername(username)
        return !response.usernameTaken
    } catch (error) {
        return true
    }
}

export const getBgColor = (playerId: number): string => {
    const colorToReturn = bgColors[playerId % 5]
    if (colorToReturn != null) return colorToReturn
    return 'bg-electric-violet'
}

export const turnCardTypeToQuestionType = (
    card: CardSchema
): QuestionSchema => {
    return {
        id: card.id,
        question: card.term ?? 'No content found',
        term: card.term,
        content: card?.content ?? 'No content found',
        qType: card?.category,
        qOrder: null,
        points: 1,
        boc2: card.boc2,
        boc3: card.boc3,
        boc4: card.boc4,
        formula: card.formula,
        promptOption: null,
    }
}
export const turnCardTypeToTempQuestionType = (
    card: CardSchema
): TempQuestionSchema => {
    return {
        id: card.id,
        question: card.term ?? 'No content found',
        term: card.term,
        content: card?.content ?? 'No content found',
        qType: card?.category,
        qOrder: null,
        points: 1,
        boc2: card.boc2,
        boc3: card.boc3,
        boc4: card.boc4,
        formula: card.formula,
        promptOption: null,
        selected: true,
        jeopardy: false,
    }
}

// const DEBOUNCE_TIME = 1000;
// useDebouncedEffect(
//   async () => {
//     setFilterValue(value);
//   },
//   [value],
//   DEBOUNCE_TIME
// );

// let lastCheckedUsername = "";
// const debouncedCheckUsername = debounce(async (value: string) => {
//   if (value !== lastCheckedUsername) {
//     lastCheckedUsername = value;

//     return await new Promise((resolve, reject) => {
//       checkUsername(value)
//         .then((isAvailable) => {
//           resolve(isAvailable);
//         })
//         .catch((error) => {
//           resolve(true);
//         });
//     });
//   } else {
//     return await Promise.resolve(true);
//   }
// }, 1000);

// function debounceAsyncFunction(fn, delay) {
//   let timeoutId = null;
//   let lastArgs;
//   let lastThis;
//   let result;

//   const debouncedFunction = async (...args) => {
//     const context = this;

//     const later = async () => {
//       timeoutId = null;
//       result = await fn.apply(context, lastArgs);
//     };

//     clearTimeout(timeoutId);
//     lastArgs = args;
//     lastThis = context;
//     timeoutId = setTimeout(later, delay);

//     return result;
//   };

//   return debouncedFunction;
// }

// let lastCheckedUsername = "";

// const checkUsernameAvailability = async (value) => {
//   if (value !== lastCheckedUsername) {
//     lastCheckedUsername = value;
//     return await new Promise((resolve, reject) => {
//       checkUsername(value)
//         .then((isAvailable) => {
//           resolve(isAvailable);
//         })
//         .catch((error) => {
//           resolve(true);
//         });
//     });
//   } else {
//     return true;
//   }
// };

// const debouncedCheckUsername = debouncedFunction(
//   checkUsernameAvailability,
//   1000
// );

// export { debouncedCheckUsername };
export { timeSinceNotification }
export { checkUsername }
export { formatDate }
export { truncate }
export { validateEmail }

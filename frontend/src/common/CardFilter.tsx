import type { CardSchema } from '@source/client'

const filterCards = (cardsData: CardSchema[], filter: string): CardSchema[] => {
    if (!Array.isArray(cardsData)) {
        return []
    }
    if (filter === 'all') return cardsData
    if (filter === 'saved') return cardsData.filter((card) => card.fav)
    return cardsData.filter((card) => card.category === filter)
}

export { filterCards }

interface Filterable {
    fav?: boolean
    type?: string
}

const filterDeckCards = <T extends Filterable>(
    cardsData: T[],
    filter: string
): T[] => {
    if (!Array.isArray(cardsData)) {
        return []
    }
    if (filter === 'all') return cardsData
    if (filter === 'saved') return cardsData.filter((card) => card.fav)
    return cardsData.filter((card) => card.type === filter)
}

export { filterDeckCards }

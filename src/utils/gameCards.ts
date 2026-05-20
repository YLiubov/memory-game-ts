import type { Goal } from "../types/goal"
import { shuffleArray } from "./shuffle"

export interface GameCardsResult {
  cards: Goal[]
  uniqueCardCount: number
}

export const createGameCards = (goals: Goal[]): GameCardsResult => {
  const isMobile = window.innerWidth <= 768

  const uniqueCardCount = isMobile ? 6 : 9

  const uniqueCards = goals.slice(0, uniqueCardCount)

  const pairedCards = uniqueCards.concat(uniqueCards)

  const cards = shuffleArray(pairedCards)

  return {
    cards,
    uniqueCardCount,
  }
}

/*
RULES / TERMINOLOGY:
- slice = takes part of array.
- concat = creates pairs.
- mobile = 6 pairs / 12 cards.
- desktop = 9 pairs / 18 cards.
*/
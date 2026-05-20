import type { GoalResponse } from "../types/goal"

class GameModel {
  public async getList(): Promise<GoalResponse> {
    const response = await fetch(`${import.meta.env.BASE_URL}goals.json`)

    const result: GoalResponse = await response.json()

    return result
  }
}

export const gameModel = new GameModel()

/*
RULES / TERMINOLOGY:
- Model = loads data.
- async / await = waits for JSON.
- import.meta.env.BASE_URL = correct path for Vite + GitHub Pages.
*/
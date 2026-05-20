import type { GoalResponse } from "../types/goal"

class GameModel {

    public async getList(): Promise<GoalResponse> {
        const data = await fetch('/goals.json')
        const result: GoalResponse = await data.json()
        return result
    }
}

export const gameModel = new GameModel
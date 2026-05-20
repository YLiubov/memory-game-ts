import type { PlayerResult } from "../types/player"

class StorageModel {
  private resultsKey = "memory-game-results"
  private playerKey = "memory-game-current-player"
  private cookieKey = "memory-game-cookie-consent"

  public setCurrentPlayer(playerName: string): void {
    sessionStorage.setItem(this.playerKey, playerName)
  }

  public getCurrentPlayer(): string {
    return sessionStorage.getItem(this.playerKey) || ""
  }

  public saveResult(result: PlayerResult): void {
    const results = this.getAllResults()

    results.push(result)

    localStorage.setItem(this.resultsKey, JSON.stringify(results))
  }

  public getAllResults(): PlayerResult[] {
    const results = localStorage.getItem(this.resultsKey)

    if (!results) return []

    return JSON.parse(results) as PlayerResult[]
  }

  public getResultsByPlayer(playerName: string): PlayerResult[] {
    return this.getAllResults().filter(
      (result) => result.playerName === playerName
    )
  }

  public getBestResult(playerName: string): number | null {
    const results = this.getResultsByPlayer(playerName)

    if (results.length === 0) return null

    return Math.min(...results.map((result) => result.time))
  }

  public setCookieConsent(value: "accepted" | "rejected"): void {
    localStorage.setItem(this.cookieKey, value)
    document.cookie = `memoryGameCookies=${value}; max-age=31536000; path=/`
  }

  public getCookieConsent(): string | null {
    return localStorage.getItem(this.cookieKey)
  }
}

export const storageModel = new StorageModel()
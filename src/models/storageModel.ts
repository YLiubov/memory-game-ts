import type { PlayerResult } from "../types/player"
import type { CookieConsent } from "../types/cookie"

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
    const savedResults = localStorage.getItem(this.resultsKey)

    if (!savedResults) return []

    try {
      return JSON.parse(savedResults) as PlayerResult[]
    } catch {
      return []
    }
  }

  public getResultsByPlayer(playerName: string): PlayerResult[] {
    return this.getAllResults().filter(
      (result) => result.playerName === playerName
    )
  }

  public getBestResult(playerName: string): PlayerResult | null {
    const results = this.getResultsByPlayer(playerName)

    if (results.length === 0) return null

    return results.sort((a, b) => a.time - b.time)[0]
  }

  public setCookieConsent(value: CookieConsent): void {
    localStorage.setItem(this.cookieKey, value)

    document.cookie = `memoryGameCookies=${value}; max-age=31536000; path=/`
  }

  public getCookieConsent(): CookieConsent | null {
    return localStorage.getItem(this.cookieKey) as CookieConsent | null
  }
}

export const storageModel = new StorageModel()

/*
RULES / TERMINOLOGY:
- localStorage = saves long-term data.
- sessionStorage = saves current session/player.
- cookies = saves consent choice.
- JSON.stringify = object to string.
- JSON.parse = string to object.
*/
import { gameModel } from "../models/gameModel"
import { storageModel } from "../models/storageModel"

import type { Goal } from "../types/goal"
import type { PlayerResult } from "../types/player"

import { createGameCards } from "../utils/gameCards"

import { createFooterView } from "../views/footerView"
import { createNameView } from "../views/nameView"
import { createGameView } from "../views/gameView"
import { createResultModalView } from "../views/resultModalView"
import {
  createCookieBannerView,
  createCookieSettingsView,
} from "../views/cookieView"
import {
  createPrivacyView,
  createAboutDeveloperView,
} from "../views/infoView"
import { createSparkEffect } from "../views/sparkView"

class GameController {
  private timer = 0
  private moves = 0
  private timerInterval: number | null = null
  private goals: Goal[] = []

  public async initGame(): Promise<void> {
    const data = await gameModel.getList()

    this.goals = data.items

    this.renderNameScreen()

    if (!storageModel.getCookieConsent()) {
      this.renderCookieBanner()
    }
  }

  private getApp(): HTMLDivElement {
    return document.querySelector("#app") as HTMLDivElement
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }

    this.timer = 0
    this.moves = 0
  }

  private renderLayout(content: HTMLElement): void {
    const app = this.getApp()

    app.innerHTML = ""

    const gameContainer = document.createElement("div")
    gameContainer.className = "game-container"

    const footer = createFooterView({
      onGame: () => this.renderNameScreen(),
      onPrivacy: () => this.renderPrivacyCenter(),
      onCookies: () => this.renderCookieSettings(),
      onAbout: () => this.renderAboutDeveloper(),
    })

    gameContainer.append(content, footer)

    app.append(gameContainer)
  }

  private renderNameScreen(): void {
    this.clearTimer()

    const savedPlayerName = storageModel.getCurrentPlayer()
    const view = createNameView(savedPlayerName)

    view.button.addEventListener("click", () => {
      const playerName = view.input.value.trim()

      if (!playerName) {
        view.input.focus()
        return
      }

      storageModel.setCurrentPlayer(playerName)

      this.renderGamePage(false)
    })

    this.renderLayout(view.screen)
  }

  private renderGamePage(isStarted: boolean): void {
    if (!isStarted) {
      this.clearTimer()
    }

    const playerName = storageModel.getCurrentPlayer()

    const { cards, uniqueCardCount } = createGameCards(this.goals)

    const view = createGameView({
      playerName,
      isStarted,
      cards,
    })

    let firstCard: HTMLButtonElement | null = null
    let secondCard: HTMLButtonElement | null = null
    let lockBoard = false
    let matchedPairs = 0

    view.mainButton.addEventListener("click", () => {
      if (isStarted) {
        this.renderGamePage(false)
      } else {
        this.renderGamePage(true)
      }
    })

    view.changePlayerButton.addEventListener("click", () => {
      this.renderNameScreen()
    })

    if (isStarted) {
      this.timerInterval = window.setInterval(() => {
        this.timer++
        view.statusText.textContent = `Time: ${this.timer}s`
      }, 1000)
    }

    view.cardButtons.forEach((card) => {
      card.addEventListener("click", () => {
        if (!isStarted) return
        if (lockBoard) return
        if (card === firstCard) return
        if (card.classList.contains("matched")) return

        card.classList.add("flipped")

        if (!firstCard) {
          firstCard = card
          return
        }

        secondCard = card
        lockBoard = true

        this.moves++
        view.movesText.textContent = `Moves: ${this.moves}`

        if (firstCard.dataset.id === secondCard.dataset.id) {
          firstCard.classList.add("matched")
          secondCard.classList.add("matched")

          matchedPairs++

          firstCard = null
          secondCard = null
          lockBoard = false

          if (matchedPairs === uniqueCardCount) {
            this.finishGame(playerName)
          }

          return
        }

        setTimeout(() => {
          firstCard?.classList.remove("flipped")
          secondCard?.classList.remove("flipped")

          firstCard = null
          secondCard = null
          lockBoard = false
        }, 1000)
      })
    })

    this.renderLayout(view.screen)
  }

  private finishGame(playerName: string): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }

    const result: PlayerResult = {
      playerName,
      time: this.timer,
      moves: this.moves,
      date: new Date().toLocaleString(),
    }

    storageModel.saveResult(result)

    createSparkEffect()

    setTimeout(() => {
      this.renderResultModal(playerName, this.timer, this.moves)
    }, 900)
  }

  private renderResultModal(
    playerName: string,
    currentTime: number,
    currentMoves: number
  ): void {
    const results = storageModel.getResultsByPlayer(playerName)
    const bestResult = storageModel.getBestResult(playerName)

    const view = createResultModalView({
      playerName,
      currentTime,
      currentMoves,
      bestResult,
      results,
    })

    view.playAgainButton.addEventListener("click", () => {
      view.modal.remove()
      this.renderGamePage(false)
    })

    view.closeButton.addEventListener("click", () => {
      view.modal.remove()
    })

    document.body.append(view.modal)
  }

  private renderCookieBanner(): void {
    const view = createCookieBannerView()

    view.acceptButton.addEventListener("click", () => {
      storageModel.setCookieConsent("accepted")
      view.banner.remove()
    })

    view.rejectButton.addEventListener("click", () => {
      storageModel.setCookieConsent("rejected")
      view.banner.remove()
    })

    view.settingsButton.addEventListener("click", () => {
      view.banner.remove()
      this.renderCookieSettings()
    })

    document.body.append(view.banner)
  }

  private renderCookieSettings(): void {
    this.clearTimer()

    const currentConsent = storageModel.getCookieConsent()
    const view = createCookieSettingsView(currentConsent)

    view.acceptButton.addEventListener("click", () => {
      storageModel.setCookieConsent("accepted")
      this.renderNameScreen()
    })

    view.rejectButton.addEventListener("click", () => {
      storageModel.setCookieConsent("rejected")
      this.renderNameScreen()
    })

    this.renderLayout(view.screen)
  }

  private renderPrivacyCenter(): void {
    this.clearTimer()

    this.renderLayout(createPrivacyView())
  }

  private renderAboutDeveloper(): void {
    this.clearTimer()

    this.renderLayout(createAboutDeveloperView())
  }
}

export const gameController = new GameController()

/*
RULES / TERMINOLOGY:
- Controller = connects Model + View.
- Model = data and storage.
- View = HTML rendering.
- Utils = reusable small functions.
- State = current timer, moves, opened cards.
- lockBoard = prevents clicking while two cards are being checked.
*/
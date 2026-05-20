import type { PlayerResult } from "../types/player"

interface ResultModalOptions {
  playerName: string
  currentTime: number
  currentMoves: number
  bestResult: PlayerResult | null
  results: PlayerResult[]
}

interface ResultModalView {
  modal: HTMLElement
  playAgainButton: HTMLButtonElement
  closeButton: HTMLButtonElement
}

export const createResultModalView = (
  options: ResultModalOptions
): ResultModalView => {
  const modal = document.createElement("div")
  modal.className = "modal-overlay"

  const attemptsHtml = options.results
    .map(
      (result) => `
        <li>
          <span>${result.date}</span>
          <strong>${result.time}s / ${result.moves} moves</strong>
        </li>
      `
    )
    .join("")

  modal.innerHTML = `
    <div class="result-modal">
      <h2>You won!</h2>

      <p>Player: <strong>${options.playerName}</strong></p>
      <p>Your time: <strong>${options.currentTime}s</strong></p>
      <p>Your moves: <strong>${options.currentMoves}</strong></p>

      <p>
        Best result:
        <strong>
          ${
            options.bestResult
              ? `${options.bestResult.time}s / ${options.bestResult.moves} moves`
              : `${options.currentTime}s / ${options.currentMoves} moves`
          }
        </strong>
      </p>

      <h3>Previous attempts</h3>

      <ul class="attempts-list">
        ${attemptsHtml}
      </ul>

      <div class="modal-actions">
        <button class="play-again-button">Play Again</button>
        <button class="close-modal-button">Close</button>
      </div>
    </div>
  `

  return {
    modal,
    playAgainButton: modal.querySelector(".play-again-button") as HTMLButtonElement,
    closeButton: modal.querySelector(".close-modal-button") as HTMLButtonElement,
  }
}

/*
RULES / TERMINOLOGY:
- modal = popup window.
- attempts = previous games.
- best result = fastest time for this player.
*/
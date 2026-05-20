import type { Goal } from "../types/goal"

interface GameViewOptions {
  playerName: string
  isStarted: boolean
  cards: Goal[]
}

interface GameViewResult {
  screen: HTMLElement
  board: HTMLElement
  statusText: HTMLParagraphElement
  movesText: HTMLParagraphElement
  mainButton: HTMLButtonElement
  changePlayerButton: HTMLButtonElement
  cardButtons: HTMLButtonElement[]
}

export const createGameView = (options: GameViewOptions): GameViewResult => {
  const screen = document.createElement("section")
  screen.className = "game-screen"

  const title = document.createElement("h1")
  title.textContent = "Memory Game"

  const gameInfo = document.createElement("div")
  gameInfo.className = "game-info"

  const playerText = document.createElement("p")
  playerText.innerHTML = `Player: <strong>${options.playerName}</strong>`

  const statusText = document.createElement("p")
  statusText.textContent = options.isStarted
    ? "Time: 0s"
    : "Press Start when you are ready."

  const movesText = document.createElement("p")
  movesText.textContent = "Moves: 0"

  const mainButton = document.createElement("button")
  mainButton.className = "restart-button"
  mainButton.textContent = options.isStarted ? "Restart" : "Start Game"

  const changePlayerButton = document.createElement("button")
  changePlayerButton.className = "restart-button"
  changePlayerButton.textContent = "Change Player"

  gameInfo.append(playerText, statusText, movesText, mainButton)

  if (!options.isStarted) {
    gameInfo.append(changePlayerButton)
  }

  const board = document.createElement("div")
  board.className = "board"

  const cardButtons: HTMLButtonElement[] = []

  options.cards.forEach((goal) => {
    const card = document.createElement("button")

    card.className = "card"
    card.dataset.id = goal.id

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${import.meta.env.BASE_URL}${goal.image}" alt="${goal.title}">
        </div>

        <div class="card-back">
          <img src="${import.meta.env.BASE_URL}assets/images/card-back.png" alt="card back">
        </div>
      </div>
    `

    cardButtons.push(card)
    board.append(card)
  })

  screen.append(title, gameInfo, board)

  return {
    screen,
    board,
    statusText,
    movesText,
    mainButton,
    changePlayerButton,
    cardButtons,
  }
}

/*
RULES / TERMINOLOGY:
- dataset.id = stores card id in HTML.
- card-front = real image.
- card-back = card backside.
- flipped class is added by controller.
*/
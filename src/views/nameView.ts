interface NameViewResult {
  screen: HTMLElement
  input: HTMLInputElement
  button: HTMLButtonElement
}

export const createNameView = (savedPlayerName: string): NameViewResult => {
  const screen = document.createElement("section")
  screen.className = "start-screen"

  screen.innerHTML = `
    <h1>Memory Game</h1>

    <div class="game-description">
      <p>Find all matching card pairs.</p>
      <p>Flip two cards at a time and remember their positions.</p>
      <p class="win-condition">Win condition: Match every pair as fast as possible.</p>
    </div>

    <p class="intro-text">Enter your name.</p>

    <input 
      class="player-input" 
      type="text" 
      placeholder="Your name"
      value="${savedPlayerName}"
    >

    <button class="start-button">Continue</button>
  `

  return {
    screen,
    input: screen.querySelector(".player-input") as HTMLInputElement,
    button: screen.querySelector(".start-button") as HTMLButtonElement,
  }
}

/*
RULES / TERMINOLOGY:
- input = user writes player name.
- querySelector = finds element in HTML.
- as HTMLInputElement = TypeScript type assertion.
*/
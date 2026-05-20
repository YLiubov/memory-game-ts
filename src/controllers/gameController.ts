import { gameModel } from "../models/gameModel";
import { storageModel } from "../models/storageModel";
import type { Goal } from "../types/goal";
import type { PlayerResult } from "../types/player";

class GameController {
  private timer = 0;
  private timerInterval: number | null = null;
  private goals: Goal[] = [];

  public async initGame(): Promise<void> {
    const data = await gameModel.getList();
    this.goals = data.items;

    this.renderNameScreen();

    if (!storageModel.getCookieConsent()) {
      this.renderCookieBanner();
    }
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.timer = 0;
  }

  private getApp(): HTMLDivElement {
    return document.querySelector("#app") as HTMLDivElement;
  }

  private renderLayout(content: HTMLElement): void {
    const app = this.getApp();

    app.innerHTML = "";

    const gameContainer = document.createElement("div");
    gameContainer.className = "game-container";

    gameContainer.append(content);
    gameContainer.append(this.createFooter());

    app.append(gameContainer);
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement("footer");
    footer.className = "footer";

    const gameButton = document.createElement("button");
    gameButton.textContent = "Game";
    gameButton.addEventListener("click", () => this.renderNameScreen());

    const privacyButton = document.createElement("button");
    privacyButton.textContent = "Privacy Center";
    privacyButton.addEventListener("click", () => this.renderPrivacyCenter());

    const cookiesButton = document.createElement("button");
    cookiesButton.textContent = "Cookie Settings";
    cookiesButton.addEventListener("click", () => this.renderCookieSettings());

    const aboutButton = document.createElement("button");
    aboutButton.textContent = "About Developer";
    aboutButton.addEventListener("click", () => this.renderAboutDeveloper());

    footer.append(gameButton, privacyButton, cookiesButton, aboutButton);

    return footer;
  }

  private renderNameScreen(): void {
    this.clearTimer();

    const screen = document.createElement("section");
    screen.className = "start-screen";

    const savedPlayerName = storageModel.getCurrentPlayer();

    screen.innerHTML = `
  <h1>Memory Game</h1>

  <div class="game-description">
    <p>
      Find all matching card pairs before the timer ends your journey.
    </p>

    <p>
      Flip two cards at a time and remember their positions.
    </p>

    <p class="win-condition">
      Win condition:
      Match every pair on the board as fast as possible.
    </p>
  </div>

  <p class="intro-text">Enter your name.</p>

  <input 
    class="player-input" 
    type="text" 
    placeholder="Your name"
    value="${savedPlayerName}"
  >

  <button class="start-button">Continue</button>
    `;

    const input = screen.querySelector(".player-input") as HTMLInputElement;
    const continueButton = screen.querySelector(
      ".start-button",
    ) as HTMLButtonElement;

    continueButton.addEventListener("click", () => {
      const playerName = input.value.trim();

      if (!playerName) {
        input.focus();
        return;
      }

      storageModel.setCurrentPlayer(playerName);
      this.renderGamePage(false);
    });

    this.renderLayout(screen);
  }

  private renderGamePage(isStarted: boolean): void {
    if (!isStarted) {
      this.clearTimer();
    }

    const playerName = storageModel.getCurrentPlayer();
    const isMobile = window.innerWidth <= 768;

    const uniqueCardCount = isMobile ? 6 : 9;
    const uniqueCards = this.goals.slice(0, uniqueCardCount);

    const cards: Goal[] = [...uniqueCards, ...uniqueCards].sort(
      () => Math.random() - 0.5,
    );

    const gameScreen = document.createElement("section");
    gameScreen.className = "game-screen";

    const title = document.createElement("h1");
    title.textContent = "Memory Game";

    const gameInfo = document.createElement("div");
    gameInfo.className = "game-info";

    const playerText = document.createElement("p");
    playerText.innerHTML = `Player: <strong>${playerName}</strong>`;

    const statusText = document.createElement("p");
    statusText.textContent = isStarted
      ? "Time: 0s"
      : "Press Start when you are ready.";

    const mainButton = document.createElement("button");
    mainButton.className = "restart-button";
    mainButton.textContent = isStarted ? "Restart" : "Start Game";

    const changePlayerButton = document.createElement("button");
    changePlayerButton.className = "restart-button";
    changePlayerButton.textContent = "Change Player";

    if (isStarted) {
      mainButton.addEventListener("click", () => {
        this.renderGamePage(false);
      });

      this.timerInterval = window.setInterval(() => {
        this.timer++;
        statusText.textContent = `Time: ${this.timer}s`;
      }, 1000);
    } else {
      mainButton.addEventListener("click", () => {
        this.renderGamePage(true);
      });
    }

    changePlayerButton.addEventListener("click", () => {
      this.renderNameScreen();
    });

    gameInfo.append(playerText, statusText, mainButton);

    if (!isStarted) {
      gameInfo.append(changePlayerButton);
    }

    const board = document.createElement("div");
    board.className = "board";

    let firstCard: HTMLButtonElement | null = null;
    let secondCard: HTMLButtonElement | null = null;
    let lockBoard = false;
    let matchedPairs = 0;

    cards.forEach((goal: Goal) => {
      const card = document.createElement("button");
      card.className = "card";
      card.dataset.id = goal.id;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="${import.meta.env.BASE_URL}${goal.image}" alt="Front image">
          </div>

          <div class="card-back">
            <img src="${import.meta.env.BASE_URL}assets/images/card-back.png" alt="card back">
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        if (!isStarted) return;
        if (lockBoard) return;
        if (card === firstCard) return;
        if (card.classList.contains("matched")) return;

        card.classList.add("flipped");

        if (!firstCard) {
          firstCard = card;
          return;
        }

        secondCard = card;
        lockBoard = true;

        if (firstCard.dataset.id === secondCard.dataset.id) {
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");

          matchedPairs++;

          firstCard = null;
          secondCard = null;
          lockBoard = false;

          if (matchedPairs === uniqueCardCount) {
            this.finishGame(playerName);
          }

          return;
        }

        setTimeout(() => {
          firstCard?.classList.remove("flipped");
          secondCard?.classList.remove("flipped");

          firstCard = null;
          secondCard = null;
          lockBoard = false;
        }, 1000);
      });

      board.append(card);
    });

    gameScreen.append(title, gameInfo, board);
    this.renderLayout(gameScreen);
  }

  private finishGame(playerName: string): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const result: PlayerResult = {
      playerName,
      time: this.timer,
      date: new Date().toLocaleString(),
    };

    storageModel.saveResult(result);
    this.renderSparkEffect();

    setTimeout(() => {
      this.renderResultModal(playerName, this.timer);
    }, 900);
  }

  private renderResultModal(playerName: string, currentTime: number): void {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";

    const results = storageModel.getResultsByPlayer(playerName);
    const bestResult = storageModel.getBestResult(playerName);

    const attemptsHtml = results
      .map(
        (result) => `
          <li>
            <span>${result.date}</span>
            <strong>${result.time}s</strong>
          </li>
        `,
      )
      .join("");

    modal.innerHTML = `
      <div class="result-modal">
        <h2>You won!</h2>

        <p>Player: <strong>${playerName}</strong></p>
        <p>Your time: <strong>${currentTime}s</strong></p>
        <p>Best result: <strong>${bestResult ?? currentTime}s</strong></p>

        <h3>Previous attempts</h3>

        <ul class="attempts-list">
          ${attemptsHtml}
        </ul>

        <div class="modal-actions">
          <button class="play-again-button">Play Again</button>
          <button class="close-modal-button">Close</button>
        </div>
      </div>
    `;

    const playAgainButton = modal.querySelector(
      ".play-again-button",
    ) as HTMLButtonElement;

    const closeButton = modal.querySelector(
      ".close-modal-button",
    ) as HTMLButtonElement;

    playAgainButton.addEventListener("click", () => {
      modal.remove();
      this.renderGamePage(false);
    });

    closeButton.addEventListener("click", () => {
      modal.remove();
    });

    document.body.append(modal);
  }

  private renderSparkEffect(): void {
    const sparkContainer = document.createElement("div");
    sparkContainer.className = "spark-container";

    for (let i = 0; i < 40; i++) {
      const spark = document.createElement("span");
      spark.className = "spark";

      spark.style.left = `${Math.random() * 100}%`;
      spark.style.animationDelay = `${Math.random() * 0.8}s`;

      sparkContainer.append(spark);
    }

    document.body.append(sparkContainer);

    setTimeout(() => {
      sparkContainer.remove();
    }, 2500);
  }

  private renderCookieBanner(): void {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";

    banner.innerHTML = `
      <h2>We value your privacy</h2>

      <p>
        This game uses localStorage, sessionStorage and cookies to save player name,
        game results and cookie preferences.
      </p>

      <div class="cookie-actions">
        <button class="reject-cookies">Reject</button>
        <button class="open-cookie-settings">More Options</button>
        <button class="accept-cookies">Agree & Continue</button>
      </div>
    `;

    const acceptButton = banner.querySelector(
      ".accept-cookies",
    ) as HTMLButtonElement;

    const rejectButton = banner.querySelector(
      ".reject-cookies",
    ) as HTMLButtonElement;

    const settingsButton = banner.querySelector(
      ".open-cookie-settings",
    ) as HTMLButtonElement;

    acceptButton.addEventListener("click", () => {
      storageModel.setCookieConsent("accepted");
      banner.remove();
    });

    rejectButton.addEventListener("click", () => {
      storageModel.setCookieConsent("rejected");
      banner.remove();
    });

    settingsButton.addEventListener("click", () => {
      banner.remove();
      this.renderCookieSettings();
    });

    document.body.append(banner);
  }

  private renderCookieSettings(): void {
    this.clearTimer();

    const screen = document.createElement("section");
    screen.className = "info-screen";

    screen.innerHTML = `
      <h1>Cookie Settings</h1>

      <p>
        This game stores your cookie choice in cookies and localStorage.
        Your current game player name is stored in sessionStorage.
        Game results are stored in localStorage.
      </p>

      <div class="settings-actions">
        <button class="accept-cookies">Accept Cookies</button>
        <button class="reject-cookies">Reject Cookies</button>
      </div>
    `;

    const acceptButton = screen.querySelector(
      ".accept-cookies",
    ) as HTMLButtonElement;

    const rejectButton = screen.querySelector(
      ".reject-cookies",
    ) as HTMLButtonElement;

    acceptButton.addEventListener("click", () => {
      storageModel.setCookieConsent("accepted");
      this.renderNameScreen();
    });

    rejectButton.addEventListener("click", () => {
      storageModel.setCookieConsent("rejected");
      this.renderNameScreen();
    });

    this.renderLayout(screen);
  }

  private renderPrivacyCenter(): void {
    this.clearTimer();

    const screen = document.createElement("section");
    screen.className = "info-screen";

    screen.innerHTML = `
      <h1>Privacy Center</h1>

      <p>
        This project saves game results locally in your browser.
      </p>

      <ul>
        <li>localStorage: previous results and best result</li>
        <li>sessionStorage: current player name</li>
        <li>cookies: cookie consent choice</li>
      </ul>

      <p>No data is sent to a server.</p>
    `;

    this.renderLayout(screen);
  }

  private renderAboutDeveloper(): void {
    this.clearTimer();

    const screen = document.createElement("section");
    screen.className = "info-screen";

    screen.innerHTML = `
      <h1>About Developer</h1>

      <p>
        This section will later include information about my portfolio,
        projects and CV.
      </p>

      <p>Developer: Liubov Yakimenko</p>
    `;

    this.renderLayout(screen);
  }
}

export const gameController = new GameController();

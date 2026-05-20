import type { CookieConsent } from "../types/cookie"

interface CookieBannerView {
  banner: HTMLElement
  acceptButton: HTMLButtonElement
  rejectButton: HTMLButtonElement
  settingsButton: HTMLButtonElement
}

export const createCookieBannerView = (): CookieBannerView => {
  const banner = document.createElement("div")
  banner.className = "cookie-banner"

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
  `

  return {
    banner,
    acceptButton: banner.querySelector(".accept-cookies") as HTMLButtonElement,
    rejectButton: banner.querySelector(".reject-cookies") as HTMLButtonElement,
    settingsButton: banner.querySelector(".open-cookie-settings") as HTMLButtonElement,
  }
}

interface CookieSettingsView {
  screen: HTMLElement
  acceptButton: HTMLButtonElement
  rejectButton: HTMLButtonElement
}

export const createCookieSettingsView = (
  currentConsent: CookieConsent | null
): CookieSettingsView => {
  const screen = document.createElement("section")
  screen.className = "info-screen"

  screen.innerHTML = `
    <h1>Cookie Settings</h1>

    <p>
      Current status:
      <strong>${currentConsent ?? "not selected"}</strong>
    </p>

    <p>
      This game stores your cookie choice in cookies and localStorage.
      Player name is stored in sessionStorage.
      Game results are stored in localStorage.
    </p>

    <div class="settings-actions">
      <button class="accept-cookies">Accept Cookies</button>
      <button class="reject-cookies">Reject Cookies</button>
    </div>
  `

  return {
    screen,
    acceptButton: screen.querySelector(".accept-cookies") as HTMLButtonElement,
    rejectButton: screen.querySelector(".reject-cookies") as HTMLButtonElement,
  }
}

/*
RULES / TERMINOLOGY:
- Cookie banner = first privacy popup.
- Cookie settings = page where user can change consent.
- consent = accepted / rejected / not selected.
*/

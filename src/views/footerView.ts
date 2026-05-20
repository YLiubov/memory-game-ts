interface FooterHandlers {
  onGame: () => void
  onPrivacy: () => void
  onCookies: () => void
  onAbout: () => void
}

export const createFooterView = (handlers: FooterHandlers): HTMLElement => {
  const footer = document.createElement("footer")
  footer.className = "footer"

  const gameButton = document.createElement("button")
  gameButton.textContent = "Game"
  gameButton.addEventListener("click", handlers.onGame)

  const privacyButton = document.createElement("button")
  privacyButton.textContent = "Privacy Center"
  privacyButton.addEventListener("click", handlers.onPrivacy)

  const cookiesButton = document.createElement("button")
  cookiesButton.textContent = "Cookie Settings"
  cookiesButton.addEventListener("click", handlers.onCookies)

  const aboutButton = document.createElement("button")
  aboutButton.textContent = "About Developer"
  aboutButton.addEventListener("click", handlers.onAbout)

  footer.append(gameButton, privacyButton, cookiesButton, aboutButton)

  return footer
}

/*
RULES / TERMINOLOGY:
- View = creates HTML.
- handlers = functions from controller.
- footer only displays navigation.
*/
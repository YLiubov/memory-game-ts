export const createPrivacyView = (): HTMLElement => {
  const screen = document.createElement("section")
  screen.className = "info-screen"

  screen.innerHTML = `
    <h1>Privacy Center</h1>

    <p>This project saves game results locally in your browser.</p>

    <ul>
      <li>localStorage: previous results and best result</li>
      <li>sessionStorage: current player name</li>
      <li>cookies: cookie consent choice</li>
    </ul>

    <p>No data is sent to a server.</p>
  `

  return screen
}

export const createAboutDeveloperView = (): HTMLElement => {
  const screen = document.createElement("section")
  screen.className = "info-screen"

  screen.innerHTML = `
    <h1>About Developer</h1>

    <p>
      This section will later include information about my portfolio,
      projects and CV.
    </p>

    <p>Developer: Liubov Yakimenko</p>
  `

  return screen
}

/*
RULES / TERMINOLOGY:
- Info views are static pages.
- Controller decides which view to render.
*/
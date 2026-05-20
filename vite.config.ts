import { defineConfig } from 'vite' // Importerer Vite config helper
import tailwindcss from '@tailwindcss/vite' // Importerer Tailwind Vite plugin

export default defineConfig({
  base: "/memory-game-ts/",
  plugins: [
    tailwindcss(), // Aktiverer Tailwind i build pipeline
  ],
})
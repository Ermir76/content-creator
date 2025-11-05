import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-8">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Social Media Content Generator</h1>
      <p class="text-gray-600 mb-6">Tailwind CSS is working! 🎉</p>
      <div class="card">
        <button id="counter" type="button" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"></button>
      </div>
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

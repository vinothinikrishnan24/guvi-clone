import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import PlayerContextProvider from './Context/PlayerContext.jsx'
import PlaylistContextProvider from './Context/PlaylistContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerContextProvider>
        <PlaylistContextProvider>
        <App />
        </PlaylistContextProvider>
      </PlayerContextProvider>

    </BrowserRouter>

  </StrictMode>,
)

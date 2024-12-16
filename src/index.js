import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import 'core-js'

import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)

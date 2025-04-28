import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'core-js'

import App from '@/App'

// react-query 클라이언트 생성
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </QueryClientProvider>
  </StrictMode>,
)

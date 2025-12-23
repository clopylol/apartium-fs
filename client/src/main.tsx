import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import './i18n'
import { QueryProvider } from './lib/query-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryProvider>
            <Toaster position="top-right" />
            <App />
        </QueryProvider>
    </React.StrictMode>,
)

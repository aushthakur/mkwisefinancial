import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ModalProvider } from './context/ModalContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </HelmetProvider>
  </React.StrictMode>,
)

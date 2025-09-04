import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import 'antd/dist/reset.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ConfigProvider theme={{ token: { borderRadius: 8 } }}>
    <AntApp>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AntApp>
  </ConfigProvider>
)

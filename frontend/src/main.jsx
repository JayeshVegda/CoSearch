import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@mantine/core/styles.css'
import './index.css'

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  // Fallback rendering
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Montserrat, sans-serif;
        background-color: #fafafa;
      ">
        <div style="text-align: center;">
          <h1>CoSearch</h1>
          <p>Something went wrong loading the app.</p>
          <button onclick="window.location.reload()" style="
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          ">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}
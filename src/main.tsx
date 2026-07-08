import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

void startApp();

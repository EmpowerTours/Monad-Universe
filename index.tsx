import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PrivyProvider } from '@privy-io/react-auth';
import { Buffer } from 'buffer';

// Fix for missing Buffer/process types on window
declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: Window;
  }
}

// Robust Polyfill execution
if (typeof window !== 'undefined') {
  if (!window.Buffer) window.Buffer = Buffer;
  if (!window.global) window.global = window;
  if (!window.process) {
    window.process = { 
      env: { NODE_ENV: 'production' },
      version: '',
      nextTick: (cb: any) => setTimeout(cb, 0)
    };
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Using the user provided App ID
const PRIVY_APP_ID = 'cmi6kl0jv00rlju0bhnd2lysc';

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet', 'email', 'google', 'twitter', 'discord'],
        appearance: {
          theme: 'dark',
          accentColor: '#836EF9',
          logo: 'https://monad.xyz/logo.svg',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
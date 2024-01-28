import React from 'react';
import { GlobalStyle, ThemeProvider } from '@react95/core';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@react95/icons/icons.css';
import './index.css';
import { ConnectKitProvider } from 'connectkit';
import { WagmiConfig } from 'wagmi';
import { win95Theme } from '~/lib/wagmi/win95Theme';
import { wagmiConfig } from '~/config';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider customTheme={win95Theme}>
        <ThemeProvider>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

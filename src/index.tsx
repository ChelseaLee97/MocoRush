import React from 'react';
import { ConnectKitProvider } from 'connectkit';
import { createRoot } from 'react-dom/client';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import original from 'react95/dist/themes/original';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { WagmiConfig } from 'wagmi';
import { win95Theme } from '~/lib/wagmi/win95Theme';
import { wagmiConfig } from '~/config';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
`;

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider customTheme={win95Theme}>
        <GlobalStyles />
        <ThemeProvider theme={original}>
          <Toaster theme="light" />
          <App />
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);

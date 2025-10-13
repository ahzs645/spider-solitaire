// Libraries
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
// Components | Utils
import App from './App';
// Assets
import './index.scss';
import { theme } from './globalStyles';

/* eslint-disable no-console */
console.log(
  "%cHi, I'm Enes. Welcome to my project. You can find more at https://enesbaspinar.me. Oh by the way, feel free to look at my CV :)",
  'background: #222; color: #bada55; padding: 4px;'
);
/* eslint-enable no-console */

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

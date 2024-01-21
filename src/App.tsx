import { Button, GlobalStyle, ThemeProvider } from '@react95/core';
import '@react95/icons/icons.css';
import '@react95/sans-serif';
import './App.css';

const App = () => (
  <ThemeProvider>
    <GlobalStyle />
    <Button>Click me!</Button>
  </ThemeProvider>
);

export default App;

import React from 'react';
import './App.css';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "./theme";
import {Header} from "./component/Header/Header";
import {Main} from "./component/Main";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <Main />
      </div>
    </ThemeProvider>
  );
}

export default App;

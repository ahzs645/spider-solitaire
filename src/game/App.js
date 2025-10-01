// Libraries
import React from 'react';
// Components | Utils
import GameContextProvider from './contexts/GameContext';
import SolitaireGame from './views/SolitaireGame';

function App() {
  return (
    <div id="app">
      <GameContextProvider>
        <SolitaireGame />
      </GameContextProvider>
    </div>
  );
}

export default App;

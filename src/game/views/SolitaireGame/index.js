// Libraries
import React, { useContext } from 'react';
// Components | Utils
import HintContextProvider from '../../contexts/HintContext';
import DraggingContextProvider from '../../contexts/DraggingContext';
import { GameContext } from '../../contexts/GameContext';
import Window from '../../components/Window';
import GameOver from '../../components/Game/GameOver';
import DeckArea from '../../components/Game/DeckArea';
import CompletedDeckArea from '../../components/Game/CompletedArea';
import HintArea from '../../components/Game/HintArea';
import DealArea from '../../components/Game/DealArea';
import DifficultyDialog from '../../components/Game/DifficultyDialog';
// Assets
import * as Styled from './styles';

function SolitaireGame() {
  const {
    cardDecks,
    setCardDecks,
    gameStats,
    setGameStats,
    startNewGame,
    showDifficultyDialog,
    setShowDifficultyDialog,
    setDifficulty,
  } = useContext(GameContext);

  const handleSelectDifficulty = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setShowDifficultyDialog(false);
  };

  const handleCancelDifficulty = () => {
    setShowDifficultyDialog(false);
    setDifficulty('medium'); // Default to medium if cancelled
  };

  /*
  ====================================================
  =================== RENDER ========================
  ====================================================
  */

  return (
    <DraggingContextProvider>
      <HintContextProvider>
        {showDifficultyDialog && (
          <DifficultyDialog
            onSelectDifficulty={handleSelectDifficulty}
            onCancel={handleCancelDifficulty}
          />
        )}
        <Window title="Spider Solitaire">
          <Styled.Board>
            <DeckArea />
            <Styled.BottomArea>
              <CompletedDeckArea
                completedDeckCount={gameStats.completedDeckCount}
              />
              <HintArea
                cardDecks={cardDecks}
                gameStats={gameStats}
                setGameStats={setGameStats}
              />
              <DealArea
                setCardDecks={setCardDecks}
                cardDecks={cardDecks}
              />
            </Styled.BottomArea>
            {gameStats.completedDeckCount === 8 && (
              <GameOver
                gameStats={gameStats}
              />
            )}
          </Styled.Board>
        </Window>
      </HintContextProvider>
    </DraggingContextProvider>
  );
}

export default SolitaireGame;

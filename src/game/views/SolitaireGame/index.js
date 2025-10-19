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
import EmptySlotWarning from '../../components/Game/EmptySlotWarning';
// Assets
import * as Styled from './styles';

function SolitaireGame() {
  const {
    cardDecks,
    setCardDecks,
    gameStats,
    setGameStats,
    beginNewGame,
    showDifficultyDialog,
    setShowDifficultyDialog,
    showEmptySlotWarning,
    setShowEmptySlotWarning,
  } = useContext(GameContext);

  const handleSelectDifficulty = (selectedDifficulty) => {
    beginNewGame(selectedDifficulty);
    setShowDifficultyDialog(false);
  };

  const handleCancelDifficulty = () => {
    setShowDifficultyDialog(false);
  };

  const handleCloseEmptySlotWarning = () => {
    setShowEmptySlotWarning(false);
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
        {showEmptySlotWarning && (
          <EmptySlotWarning onClose={handleCloseEmptySlotWarning} />
        )}
        <Window title="Spider Solitaire">
          <Styled.Board>
            <DeckArea />
            <Styled.BottomArea>
              <CompletedDeckArea
                completedDecks={gameStats.completedDecks}
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
            {gameStats.completedDecks.length === 8 && <GameOver />}
          </Styled.Board>
        </Window>
      </HintContextProvider>
    </DraggingContextProvider>
  );
}

export default SolitaireGame;

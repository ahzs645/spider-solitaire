// Libraries
import React, { useEffect } from 'react';
// Components | Utils
import { newGame } from '../../../utils/cardUtils';
import getSounds from '../../../utils/soundUtils';
// Assets
import * as Styled from './styles';

function GameOver(props) {
  const { startNewGame, gameStats, setGameStats } = props;

  const [winSound] = getSounds('win');

  /*
  ====================================================
  ================== USE EFFECT ======================
  ====================================================
  */

  useEffect(() => {
    winSound.play();
  }, [winSound]);

  /*
  ====================================================
  =================== HANDLER ========================
  ====================================================
  */

  const handleNewGameClick = () => {
    const [cDecks, dDecks] = newGame();
    startNewGame(cDecks, dDecks);
    setGameStats({
      completedDeckCount: 0,
      score: 500,
      moves: 0,
    });
  };

  /*
  ====================================================
  =================== RENDER ========================
  ====================================================
  */

  return (
    <>
      <Styled.WinScreen>
        <span>You Won!</span>
      </Styled.WinScreen>

      <Styled.Window>
        <Styled.TitleBar>
          <span>Game Over</span>
        </Styled.TitleBar>

        <Styled.WindowBody>
          <p>
            Congratulations!
            <br />
            You won with {gameStats?.score} points in{' '}
            {gameStats?.moves} moves.
          </p>
          <p> Do you want to start another game?</p>
          <Styled.YesButton onClick={handleNewGameClick}>
            Yes
          </Styled.YesButton>
        </Styled.WindowBody>
      </Styled.Window>
    </>
  );
}

export default React.memo(GameOver);

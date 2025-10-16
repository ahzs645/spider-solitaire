// Libraries
import React, { useEffect, useContext } from 'react';
// Components | Utils
import { GameContext } from '../../../contexts/GameContext';
import getSounds from '../../../utils/soundUtils';
// Assets
import * as Styled from './styles';

function GameOver(props) {
  const { gameStats } = props;
  const { setShowDifficultyDialog } = useContext(GameContext);

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
    setShowDifficultyDialog(true);
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

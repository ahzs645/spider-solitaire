// Libraries
import React, { useEffect, useContext } from 'react';
// Components | Utils
import { GameContext } from '../../../contexts/GameContext';
import getSounds from '../../../utils/soundUtils';
// Assets
import * as Styled from './styles';
import FireworksCanvas from './FireworksCanvas';

function GameOver() {
  const { setShowDifficultyDialog, showDifficultyDialog } =
    useContext(GameContext);

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

  if (showDifficultyDialog) {
    return null;
  }

  return (
    <>
      <FireworksCanvas isActive={!showDifficultyDialog} />
      <Styled.WinScreen>You Won!</Styled.WinScreen>
      <Styled.Overlay>
        <Styled.XPWrapper>
          <div className="window" style={{ width: '320px', maxWidth: '90vw' }}>
            <div className="title-bar">
              <div className="title-bar-text">Congratulations</div>
            </div>
            <div className="window-body" style={{ padding: '16px 18px' }}>
              <Styled.Body>
                <p>
                  Congratulations! You solved the puzzle.
                </p>
                <p>Do you want to start another game?</p>
                <Styled.ActionsRow>
                  <Styled.PrimaryButton onClick={handleNewGameClick}>
                    New Game
                  </Styled.PrimaryButton>
                </Styled.ActionsRow>
              </Styled.Body>
            </div>
          </div>
        </Styled.XPWrapper>
      </Styled.Overlay>
    </>
  );
}

export default React.memo(GameOver);

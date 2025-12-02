// Libraries
import React, { useContext } from 'react';
// Components | Utils
import { GameContext } from '../../contexts/GameContext';
// Assets
import * as Styled from './styles';

function StatusBar() {
  const { gameStats, dealingDecks } = useContext(GameContext);

  const moves = gameStats.moves || 0;
  const score = gameStats.score || 500;
  const dealsLeft = dealingDecks.length;

  return (
    <Styled.StatusBarContainer>
      <Styled.StatusBarField style={{ flex: 1 }}>
        Score: {score}
      </Styled.StatusBarField>
      <Styled.StatusBarField style={{ width: '100px' }}>
        Moves: {moves}
      </Styled.StatusBarField>
      <Styled.StatusBarField style={{ width: '100px' }}>
        Deals: {dealsLeft}
      </Styled.StatusBarField>
      <Styled.StatusBarGrip />
    </Styled.StatusBarContainer>
  );
}

export default StatusBar;

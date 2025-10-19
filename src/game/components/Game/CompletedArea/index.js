// Libraries
import React from 'react';
// Components | Utils
import Card from '../Card';
// Assets
import * as Styled from './styles';

const CompletedDeckArea = (props) => {
  const { completedDecks } = props;

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return (
    <Styled.CompletedDeckArea>
      {React.Children.toArray(
        completedDecks.map((kingCard) => <Card card={kingCard} />)
      )}
    </Styled.CompletedDeckArea>
  );
};

export default React.memo(CompletedDeckArea);

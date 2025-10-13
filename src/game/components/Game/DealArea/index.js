// Libraries
import React, { useContext } from 'react';
// Components | Utils
import Card from '../Card';
import { deal } from '../../../utils/cardUtils';
import getSounds from '../../../utils/soundUtils';
// Assets
import * as Styled from './styles';
import { GameContext } from '../../../contexts/GameContext';

function DealArea(props) {
  const { setCardDecks, cardDecks } = props;
  const [cannotDealSound, dealSound] = getSounds(
    'cannot-deal',
    'deal',
  );
  const {
    dealingDecks,
    setDealingDecks,
    triggerDealAnimation,
    isDealAnimationRunning,
  } = useContext(GameContext);
  /*
  ====================================================
  =================== HANDLER ========================
  ====================================================
  */

  const handleDealClick = () => {
    if (isDealAnimationRunning) {
      return;
    }

    dealSound.play();

    const [returnCardDecks, returnDealingDecks] = deal(
      cardDecks,
      dealingDecks,
      cannotDealSound,
    );

    setCardDecks(returnCardDecks);
    setDealingDecks(returnDealingDecks);

    const newlyDealtCards = Array.from({ length: 10 }, (_, index) => {
      const deck = returnCardDecks[`deck${index + 1}`];
      if (!deck || deck.cards.length === 0) {
        return undefined;
      }
      return deck.cards[deck.cards.length - 1];
    }).filter(Boolean);

    triggerDealAnimation(newlyDealtCards);
  };

  /*
  ====================================================
  =================== RENDER ========================
  ====================================================
  */

  return (
    <Styled.DealArea
      data-cy="deal-area"
      onClick={
        dealingDecks.length && !isDealAnimationRunning
          ? handleDealClick
          : undefined
      }
      dealingDecksLength={dealingDecks.length}
    >
      {React.Children.toArray(
        Array(dealingDecks.length).fill(<Card isClose />),
      )}
    </Styled.DealArea>
  );
}

export default React.memo(DealArea);

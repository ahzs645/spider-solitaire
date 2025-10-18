// Libraries
import React, { useContext, useRef, useEffect } from 'react';
// Components | Utils
import Card from '../Card';
import { deal } from '../../../utils/cardUtils';
import getSounds from '../../../utils/soundUtils';
// Assets
import * as Styled from './styles';
import { GameContext } from '../../../contexts/GameContext';

function DealArea(props) {
  const { setCardDecks, cardDecks } = props;
  const dealAreaRef = useRef(null);
  const [cannotDealSound, dealSound] = getSounds(
    'cannot-deal',
    'deal',
  );
  const {
    dealingDecks,
    setDealingDecks,
    triggerDealAnimation,
    isDealAnimationRunning,
    setDealDeckPosition,
  } = useContext(GameContext);

  useEffect(() => {
    if (dealAreaRef.current) {
      const updatePosition = () => {
        const rect = dealAreaRef.current.getBoundingClientRect();
        setDealDeckPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [setDealDeckPosition]);
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
      ref={dealAreaRef}
      data-cy="deal-area"
      onClick={
        dealingDecks.length && !isDealAnimationRunning
          ? handleDealClick
          : undefined
      }
      $dealingDecksLength={dealingDecks.length}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const positionFromRight = 5 - index;
        const shouldShow = positionFromRight <= dealingDecks.length;
        return shouldShow ? (
          <div key={index} className="card" data-position={index + 1}>
            <Card isClose />
          </div>
        ) : null;
      })}
    </Styled.DealArea>
  );
}

export default React.memo(DealArea);

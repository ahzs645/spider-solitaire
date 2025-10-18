// Libraries
import React, { useContext, useRef, useEffect, useState } from 'react';
// Components | Utils
import Card from '../Card';
import { deal } from '../../../utils/cardUtils';
import getSounds from '../../../utils/soundUtils';
// Assets
import * as Styled from './styles';
import { GameContext } from '../../../contexts/GameContext';

const DEAL_ANIMATION_FALLBACK_SIZE = {
  width: 71,
  height: 96,
};
const FLYING_CARD_DURATION = 400;
const FLYING_CARD_DELAY_STEP = 50;
const FLYING_CARD_INITIAL_DELAY = 50;

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
    setFlyingCards,
    deckPositions,
    dealDeckPosition,
  } = useContext(GameContext);

  const [isFlipped, setIsFlipped] = useState(false);

  // Reset isFlipped when dealingDecks changes
  useEffect(() => {
    setIsFlipped(false);
  }, [dealingDecks]);

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
    if (isDealAnimationRunning || dealingDecks.length === 0) {
      return;
    }

    // Check all decks have at least one card
    const canDeal = Object.values(cardDecks).every(
      (deck) => deck.cards.length > 0
    );

    if (!canDeal) {
      cannotDealSound.play();
      return;
    }

    dealSound.play();

    // Get the cards that will be dealt
    const dealCards = dealingDecks[0];
    if (!dealCards || dealCards.length < 10) {
      return;
    }

    triggerDealAnimation(dealCards);

    // First, flip all cards instantly
    setIsFlipped(true);

    // Then start flying animation after a brief moment
    setTimeout(() => {
      // Measure the visible stock card so the overlay animation lines up with the DOM element
      const topCardImage =
        dealAreaRef.current?.querySelector(
          '.card[data-position="1"] .card img',
        );
      const cardRect = topCardImage?.getBoundingClientRect();
      const cardWidth =
        cardRect?.width ?? DEAL_ANIMATION_FALLBACK_SIZE.width;
      const cardHeight =
        cardRect?.height ?? DEAL_ANIMATION_FALLBACK_SIZE.height;
      const startLeft = cardRect
        ? cardRect.left
        : dealDeckPosition.x - cardWidth / 2;
      const startTop = cardRect
        ? cardRect.top
        : dealDeckPosition.y - cardHeight / 2;
      const timestamp = Date.now();

      const flyingCardsData = dealCards.map((card, index) => {
        const deckId = `deck${index + 1}`;
        const targetPos = deckPositions[deckId];
        const targetWidth = targetPos?.width ?? cardWidth;
        const endLeft = targetPos
          ? targetPos.x - targetWidth / 2
          : startLeft;
        const endTop = targetPos ? targetPos.y : startTop;

        return {
          id: `flying-${card.id}-${timestamp}-${index}`,
          card,
          startPos: { x: startLeft, y: startTop },
          endPos: { x: endLeft, y: endTop },
          size: { width: cardWidth, height: cardHeight },
          delay: index * FLYING_CARD_DELAY_STEP, // 50ms delay between each card
        };
      });

      setFlyingCards(flyingCardsData);

      // Wait for flying animation to complete, then update game state
      setTimeout(() => {
        const [returnCardDecks, returnDealingDecks] = deal(
          cardDecks,
          dealingDecks,
          cannotDealSound,
        );
        setCardDecks(returnCardDecks);
        setDealingDecks(returnDealingDecks);
      }, (dealCards.length - 1) * FLYING_CARD_DELAY_STEP + FLYING_CARD_DURATION);
    }, FLYING_CARD_INITIAL_DELAY); // Brief delay to show the flip
  };

  /*
  ====================================================
  =================== RENDER ========================
  ====================================================
  */

  // Get the current top deck cards if available
  const topDeckCards = dealingDecks.length > 0 ? dealingDecks[0] : [];

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
            {topDeckCards.length > 0 ? (
              <Card card={topDeckCards[0]} isClose={!isFlipped} />
            ) : (
              <Card isClose />
            )}
          </div>
        ) : null;
      })}
    </Styled.DealArea>
  );
}

export default React.memo(DealArea);

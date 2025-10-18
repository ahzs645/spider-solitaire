// Libraries
import React, { useContext, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
// Components | Utils
import { DraggingContext } from '../../../contexts/DraggingContext';
import { HintContext } from '../../../contexts/HintContext';
import { GameContext } from '../../../contexts/GameContext';
import Card from '../Card/index';
import { getIndexWhichNextCardsDraggable } from '../../../utils/cardUtils';
// Assets
import * as Styled from './styles';

const Deck = (props) => {
  const { deckNo, deck } = props;

  const { indicesOfSelectedCards } = useContext(DraggingContext);
  const { hint } = useContext(HintContext);
  const { setDeckPositions } = useContext(GameContext);
  const deckRef = useRef(null);

  const { setNodeRef } = useDroppable({
    id: `deck${deckNo}`,
  });

  // Register deck position for flying card animations
  useEffect(() => {
    const updatePosition = () => {
      if (!deckRef.current) {
        return;
      }

      const deckElement = deckRef.current;
      const deckRect = deckElement.getBoundingClientRect();
      const cardElements = deckElement.querySelectorAll('.card');
      let x = deckRect.left + deckRect.width / 2;
      let y = deckRect.top;
      let width = deckRect.width;
      let height = deckRect.height;

      if (cardElements.length > 0) {
        const topCardElement = cardElements[cardElements.length - 1];
        const topCardRect = topCardElement.getBoundingClientRect();
        x = topCardRect.left + topCardRect.width / 2;
        width = topCardRect.width;
        height = topCardRect.height;

        let spacing = 16;
        if (cardElements.length >= 2) {
          const previousCardElement =
            cardElements[cardElements.length - 2];
          const previousCardRect =
            previousCardElement.getBoundingClientRect();
          spacing = Math.max(
            topCardRect.top - previousCardRect.top,
            0,
          );
        } else {
          const viewportSpacing = Math.min(
            window.innerWidth * 0.025,
            window.innerHeight * 0.03,
          );
          spacing = Math.max(
            Math.min(viewportSpacing, 16),
            8,
          );
        }

        y = topCardRect.top + spacing;
      }

      setDeckPositions((prev) => ({
        ...prev,
        [`deck${deckNo}`]: {
          x,
          y,
          width,
          height,
        },
      }));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [deckNo, setDeckPositions, deck.cards.length]); // Re-register when card count changes

  let indexWhichNextCardsDraggable;

  if ('cards' in deck) {
    indexWhichNextCardsDraggable =
      getIndexWhichNextCardsDraggable(deck);
  }

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  const combinedRef = (node) => {
    setNodeRef(node);
    deckRef.current = node;
  };

  return (
    'cards' in deck && (
      <Styled.Deck
        ref={combinedRef}
        $deckLength={deck.cards.length}
      >
        <Styled.Placeholder>
          <Styled.EmptyCardImage
            src={`${process.env.PUBLIC_URL}/Empty_Card.png`}
            alt="Empty card slot"
          />
        </Styled.Placeholder>
        {deck.cards.map((value, index) => {
          return (
            <Card
              key={value?.id ?? `deck${deckNo}${index}`}
              index={index}
              deckNo={deckNo}
              card={value}
              isClose={
                index < deck.cards.length - deck.visibleCardCount
              }
              isDragDisabled={
                index < indexWhichNextCardsDraggable
              }
              isInSelectedCards={
                indicesOfSelectedCards.deckId ===
                  `deck${deckNo}` &&
                indicesOfSelectedCards.items
                  .slice(1)
                  .includes(index)
              }
              isDestinationInHint={
                hint.destinationDeckId === `deck${deckNo}` &&
                hint.destinationStartingIndex <= index
              }
              isSourceInHint={
                hint.sourceDeckId === `deck${deckNo}` &&
                hint.sourceStartingIndex <= index
              }
            />
          );
        })}
      </Styled.Deck>
    )
  );
};

export default React.memo(Deck);

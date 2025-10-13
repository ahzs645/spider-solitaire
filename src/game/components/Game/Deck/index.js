// Libraries
import React, { useContext } from 'react';
import { useDroppable } from '@dnd-kit/core';
// Components | Utils
import { DraggingContext } from '../../../contexts/DraggingContext';
import { HintContext } from '../../../contexts/HintContext';
import Card from '../Card/index';
import { getIndexWhichNextCardsDraggable } from '../../../utils/cardUtils';
// Assets
import * as Styled from './styles';

const Deck = (props) => {
  const { deckNo, deck } = props;

  const { indicesOfSelectedCards } = useContext(DraggingContext);
  const { hint } = useContext(HintContext);

  const { setNodeRef } = useDroppable({
    id: `deck${deckNo}`,
  });

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

  return (
    'cards' in deck && (
      <Styled.Deck
        ref={setNodeRef}
        deckLength={deck.cards.length}
      >
        <Styled.Placeholder>
          <svg data-testid="deneme" viewBox="0 0 71 96" />
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

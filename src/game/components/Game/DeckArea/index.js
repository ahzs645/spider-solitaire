// Libraries
import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
// Components | Utils
import { GameContext } from '../../../contexts/GameContext';
import { DraggingContext } from '../../../contexts/DraggingContext';
import Deck from '../Deck';
import { CardArtwork } from '../Card';
import { moveCards } from '../../../utils/cardUtils';
// Assets
import * as Styled from './styles';

const DeckArea = () => {
  const { cardDecks, gameStats, setGameStats, setCardDecks } =
    useContext(GameContext);
  const { indicesOfSelectedCards, setIndicesOfSelectedCards } =
    useContext(DraggingContext);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const restrictToViewport = useCallback(
    ({ transform, activeNodeRect }) => {
      if (!transform || !activeNodeRect) {
        return transform;
      }

      const clamp = (value, min, max) => {
        if (max < min) {
          return min;
        }
        if (value < min) {
          return min;
        }
        if (value > max) {
          return max;
        }
        return value;
      };

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.scrollX || 0;
      const scrollY = window.scrollY || 0;

      const minX = scrollX - activeNodeRect.left;
      const maxX =
        scrollX +
        viewportWidth -
        (activeNodeRect.left + activeNodeRect.width);
      const minY = scrollY - activeNodeRect.top;
      const maxY =
        scrollY +
        viewportHeight -
        (activeNodeRect.top + activeNodeRect.height);

      return {
        ...transform,
        x: clamp(transform.x, minX, maxX),
        y: clamp(transform.y, minY, maxY),
      };
    },
    [],
  );

  const dragModifiers = useMemo(
    () => [restrictToViewport],
    [restrictToViewport],
  );

  /*
  ====================================================
  =================== HANDLER ========================
  ====================================================
  */

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Cards saved during drag are cleared.
    setIndicesOfSelectedCards({
      deckId: '',
      items: [],
    });

    setActiveId(null);

    // Saves dragged cards.
    if (!over) {
      return;
    }

    const dragInfo = active.id.split('-');
    const sourceDeckId = dragInfo[0];
    const sourceIndex = parseInt(dragInfo[1], 10);

    const destinationDeckId = over.id;

    // Do nothing if the deck from which the card was drawn is the
    // same as the deck it was dragged into.
    if (sourceDeckId === destinationDeckId) {
      return;
    }

    // Get the destination deck's card count to determine the drop index
    const destinationDeck = cardDecks[destinationDeckId];
    const destinationIndex = destinationDeck.cards.length;

    const source = {
      droppableId: sourceDeckId,
      index: sourceIndex,
    };

    const destination = {
      droppableId: destinationDeckId,
      index: destinationIndex,
    };

    const { newCardDecks, isThereACompletedDeck, completedKingCard, isDragSuccessful } =
      moveCards(cardDecks, source, destination);

    // Update list if drag is successful.
    if (isDragSuccessful) {
      const previousGameStats = { ...gameStats };
      previousGameStats.moves += 1;
      previousGameStats.score -= 1;

      if (isThereACompletedDeck && completedKingCard) {
        previousGameStats.completedDecks = [...previousGameStats.completedDecks, completedKingCard];
        previousGameStats.score += 100;
      }

      setGameStats(previousGameStats);
      setCardDecks(newCardDecks);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    const dragInfo = active.id.split('-');
    const sourceDeckId = dragInfo[0];
    const sourceCardIndex = parseInt(dragInfo[1], 10);
    const sourceDeck = { ...cardDecks[sourceDeckId] };

    // Saves dragged cards.
    setIndicesOfSelectedCards({
      deckId: sourceDeckId,
      items: Array.from(
        {
          length: sourceDeck.cards.length - sourceCardIndex,
        },
        (_, i) => i + sourceCardIndex
      ),
    });
  };

  const activeDraggedCards = useMemo(() => {
    if (!activeId) {
      return null;
    }

    const [sourceDeckId] = activeId.split('-');
    const sourceDeck = cardDecks[sourceDeckId];

    if (
      !sourceDeck ||
      indicesOfSelectedCards.deckId !== sourceDeckId ||
      indicesOfSelectedCards.items.length === 0
    ) {
      return null;
    }

    return indicesOfSelectedCards.items
      .map((cardIndex) => {
        const card = sourceDeck.cards[cardIndex];

        if (!card) {
          return null;
        }

        return {
          id: `${sourceDeckId}-${cardIndex}`,
          card,
          isClose:
            cardIndex <
            sourceDeck.cards.length - sourceDeck.visibleCardCount,
        };
      })
      .filter(Boolean);
  }, [activeId, cardDecks, indicesOfSelectedCards]);

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={dragModifiers}
    >
      <Styled.DeckArea>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((no) => (
          <Deck key={no} deckNo={no} deck={cardDecks[`deck${no}`]} />
        ))}
      </Styled.DeckArea>
      <DragOverlay>
        {activeDraggedCards ? (
          <Styled.DragOverlayColumn
            $cardCount={activeDraggedCards.length}
          >
            <Styled.DragOverlayPlaceholder />
            {activeDraggedCards.map((card) => (
              <Styled.DragOverlayCard key={card.id}>
                <CardArtwork card={card.card} isClose={card.isClose} />
              </Styled.DragOverlayCard>
            ))}
          </Styled.DragOverlayColumn>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DeckArea;

// Libraries
import React, { useContext } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
// Components | Utils
import {
  cardBackImage,
  cardImages,
  cardInverseImages,
  getRankLabel,
} from '../../../utils/cardUtils';
import getSounds from '../../../utils/soundUtils';
import {
  GameContext,
  INITIAL_DEAL_ANIMATION_DELAY,
} from '../../../contexts/GameContext';
// Assets
import * as Styled from './styles';

function CardArtworkComponent({ card, isClose, useInverse = false }) {
  if (isClose || !card) {
    return (
      <Styled.CardBackImage
        draggable={false}
        src={cardBackImage}
        alt="card"
      />
    );
  }

  const rankLabel = getRankLabel(card.rank);
  const imageSet = useInverse ? cardInverseImages : cardImages;
  const cardImage = imageSet[card.suit][card.rank];

  return (
    <Styled.CardImage
      draggable={false}
      src={cardImage}
      alt={`card ${rankLabel} of ${card.suit}`}
      data-testid="card-face"
    />
  );
}

export const CardArtwork = React.memo(CardArtworkComponent);

function Card(props) {
  const {
    index,
    deckNo,
    card,
    isClose,
    isDragDisabled,
    isInSelectedCards,
    isSourceInHint,
    isDestinationInHint,
  } = props;

  const [mouseDownSound] = getSounds('mouse-down');

  const { dealAnimationOrder, isDealAnimationRunning } =
    useContext(GameContext);

  const dealOrder =
    card && isDealAnimationRunning
      ? dealAnimationOrder[card.id]
      : undefined;
  const shouldAnimateDeal =
    typeof dealOrder === 'number' && isDealAnimationRunning;
  const dealAnimationDelay = shouldAnimateDeal
    ? dealOrder * INITIAL_DEAL_ANIMATION_DELAY
    : 0;

  const dragDisabled = isDragDisabled || isDealAnimationRunning;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `deck${deckNo}-${index}`,
      disabled: dragDisabled,
    });

  const handleMouseDownFromCard = (e) => {
    e.preventDefault();
    mouseDownSound.play();
  };

  /*
  ====================================================
  ==================== FUNCTIONS =====================
  ====================================================
  */

  function getStyle() {
    const style = {
      transform: CSS.Translate.toString(transform),
      zIndex: isDragging ? 2000 : 1,
    };

    if (isDragging) {
      // Hide the original element while the drag preview is rendered via the overlay.
      return {
        ...style,
        opacity: 0,
        pointerEvents: 'none',
      };
    }

    if (isInSelectedCards) {
      return {
        ...style,
        display: 'none',
        // We override the "translate(... px)" that performs the sliding behavior as "none".
        transform: 'none',
      };
    }

    if (shouldAnimateDeal) {
      style.zIndex = 1000 + dealOrder;
    }

    return {
      ...style,
      // We override the "translate(... px)" that performs the sliding behavior as "none".
      transform: 'none',
    };
  }

  const shouldUseInverse = isSourceInHint || isDestinationInHint;

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return deckNo ? (
    <Styled.CardContainer
      ref={setNodeRef}
      style={getStyle()}
      {...listeners}
      {...attributes}
      $initialDealActive={shouldAnimateDeal}
      $initialDealDelay={dealAnimationDelay}
      onMouseDown={
        !dragDisabled ? handleMouseDownFromCard : undefined
      }
    >
      <div className="card">
        <CardArtwork
          card={card}
          isClose={isClose}
          useInverse={shouldUseInverse}
        />
      </div>
    </Styled.CardContainer>
  ) : (
    <div className="card">
      <CardArtwork
        card={card}
        isClose={isClose}
        useInverse={shouldUseInverse}
      />
    </div>
  );
}

export default React.memo(Card);

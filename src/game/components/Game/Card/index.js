// Libraries
import React, {
  useContext,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
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

  const cardRef = useRef(null);
  const [animationOffset, setAnimationOffset] = useState({ x: 0, y: 0 });
  const [mouseDownSound] = getSounds('mouse-down');

  const { dealAnimationOrder, isDealAnimationRunning, dealDeckPosition } =
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

  // Calculate animation offset when deal animation starts
  useLayoutEffect(() => {
    if (shouldAnimateDeal && cardRef.current && dealDeckPosition.x > 0) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;

      setAnimationOffset({
        x: dealDeckPosition.x - cardCenterX,
        y: dealDeckPosition.y - cardCenterY,
      });
    }
  }, [shouldAnimateDeal, dealDeckPosition]);

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
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node;
      }}
      style={getStyle()}
      {...listeners}
      {...attributes}
      $initialDealActive={shouldAnimateDeal}
      $initialDealDelay={dealAnimationDelay}
      $animationOffsetX={animationOffset.x}
      $animationOffsetY={animationOffset.y}
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

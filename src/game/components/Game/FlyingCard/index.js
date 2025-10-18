// Libraries
import React, { useEffect } from 'react';
// Assets
import * as Styled from './styles';
import { CardArtwork } from '../Card';

const FALLBACK_CARD_SIZE = {
  width: 71,
  height: 96,
};

function FlyingCard({
  card,
  startPos,
  endPos,
  delay,
  onComplete,
  width,
  height,
}) {
  useEffect(() => {
    // Complete animation and call callback
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, delay + 400); // 400ms for the flight animation

    return () => {
      clearTimeout(completeTimer);
    };
  }, [delay, onComplete]);

  const cardWidth =
    typeof width === 'number' ? width : FALLBACK_CARD_SIZE.width;
  const cardHeight =
    typeof height === 'number' ? height : FALLBACK_CARD_SIZE.height;

  return (
    <Styled.FlyingCardWrapper
      $startX={startPos.x}
      $startY={startPos.y}
      $endX={endPos.x}
      $endY={endPos.y}
      $delay={delay}
      $cardWidth={cardWidth}
      $cardHeight={cardHeight}
    >
      <CardArtwork card={card} isClose={false} />
    </Styled.FlyingCardWrapper>
  );
}

export default FlyingCard;

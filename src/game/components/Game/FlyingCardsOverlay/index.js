// Libraries
import React, { useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import FlyingCard from '../FlyingCard';

function FlyingCardsOverlay() {
  const { flyingCards, setFlyingCards } = useContext(GameContext);

  const handleCardComplete = (cardId) => {
    setFlyingCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  return (
    <>
      {flyingCards.map((flyingCard) => (
        <FlyingCard
          key={flyingCard.id}
          card={flyingCard.card}
          startPos={flyingCard.startPos}
          endPos={flyingCard.endPos}
          delay={flyingCard.delay}
          width={flyingCard.size?.width}
          height={flyingCard.size?.height}
          onComplete={() => handleCardComplete(flyingCard.id)}
        />
      ))}
    </>
  );
}

export default FlyingCardsOverlay;

// Libraries
import React, {
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
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

  const getTopCardRect = useCallback(() => {
    const dealAreaElement = dealAreaRef.current;

    if (!dealAreaElement) {
      return null;
    }

    const childCards = Array.from(dealAreaElement.children).filter(
      (node) =>
        node instanceof HTMLElement && node.classList.contains('card'),
    );

    const visibleCards = childCards.filter(
      (node) => node.offsetParent !== null,
    );

    if (visibleCards.length === 0) {
      return null;
    }

    const topMostCard = visibleCards.reduce((farthest, element) => {
      const currentPosition = Number(element.dataset.position) || -Infinity;
      if (!farthest) {
        return element;
      }

      const farthestPosition =
        Number(farthest.dataset.position) || -Infinity;

      return currentPosition > farthestPosition ? element : farthest;
    }, null);

    if (!topMostCard) {
      return null;
    }

    const measurementTarget =
      topMostCard.querySelector('img') || topMostCard;

    return measurementTarget.getBoundingClientRect();
  }, []);

  const updateDealDeckPosition = useCallback(() => {
    const topCardRect = getTopCardRect();
    const fallbackRect = dealAreaRef.current
      ? dealAreaRef.current.getBoundingClientRect()
      : null;

    const targetRect = topCardRect || fallbackRect;

    if (!targetRect) {
      return;
    }

    setDealDeckPosition({
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    });
  }, [getTopCardRect, setDealDeckPosition]);

  useEffect(() => {
    if (!dealAreaRef.current || isDealAnimationRunning) {
      return undefined;
    }

    const animationFrameId = requestAnimationFrame(
      updateDealDeckPosition,
    );

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    dealingDecks,
    isDealAnimationRunning,
    updateDealDeckPosition,
  ]);

  useEffect(() => {
    if (!dealAreaRef.current) {
      return undefined;
    }

    let resizeAnimationFrameId = null;

    const handleResize = () => {
      if (isDealAnimationRunning) {
        return;
      }

      if (resizeAnimationFrameId !== null) {
        cancelAnimationFrame(resizeAnimationFrameId);
      }

      resizeAnimationFrameId = requestAnimationFrame(() => {
        resizeAnimationFrameId = null;
        updateDealDeckPosition();
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeAnimationFrameId !== null) {
        cancelAnimationFrame(resizeAnimationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isDealAnimationRunning, updateDealDeckPosition]);
  /*
  ====================================================
  =================== HANDLER ========================
  ====================================================
  */

  const handleDealClick = () => {
    if (isDealAnimationRunning) {
      return;
    }

    updateDealDeckPosition();

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

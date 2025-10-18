// Libraries
import React, {
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
// Components | Utils
import Card, { CardArtwork } from '../Card';
import { deal } from '../../../utils/cardUtils';
import getSounds from '../../../utils/soundUtils';
// Assets
import * as Styled from './styles';
import {
  GameContext,
  INITIAL_DEAL_ANIMATION_DELAY,
  INITIAL_DEAL_ANIMATION_DURATION,
} from '../../../contexts/GameContext';

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
    pendingDealCards,
    setPendingDealCards,
  } = useContext(GameContext);
  const scheduledDealFrameRef = useRef(null);
  const pendingRemovalTimeoutsRef = useRef([]);
  const [pendingActiveIndex, setPendingActiveIndex] = useState(0);

  const getTopCardRect = useCallback(() => {
    const dealAreaElement = dealAreaRef.current;

    if (!dealAreaElement) {
      return null;
    }

    const pendingFrontCard = dealAreaElement.querySelector(
      '[data-pending-card="front"]',
    );

    if (pendingFrontCard) {
      const pendingMeasurementTarget =
        pendingFrontCard.querySelector('img') || pendingFrontCard;

      return pendingMeasurementTarget.getBoundingClientRect();
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

  const hasMeasuredPendingRef = useRef(false);

  useLayoutEffect(() => {
    if (!pendingDealCards.length) {
      hasMeasuredPendingRef.current = false;
      return undefined;
    }

    if (isDealAnimationRunning && hasMeasuredPendingRef.current) {
      return undefined;
    }

    hasMeasuredPendingRef.current = true;

    const frameId = requestAnimationFrame(updateDealDeckPosition);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [
    pendingDealCards.length,
    isDealAnimationRunning,
    updateDealDeckPosition,
  ]);

  useEffect(() => {
    return () => {
      if (scheduledDealFrameRef.current !== null) {
        cancelAnimationFrame(scheduledDealFrameRef.current);
      }
      pendingRemovalTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      pendingRemovalTimeoutsRef.current = [];
      setPendingActiveIndex(0);
    };
  }, []);

  useEffect(() => {
    if (pendingDealCards.length === 0) {
      pendingRemovalTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      pendingRemovalTimeoutsRef.current = [];
      setPendingActiveIndex(0);
    }
  }, [pendingDealCards.length]);

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
    pendingDealCards,
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

    if (!dealingDecks.length) {
      return;
    }

    const nextDealCards = dealingDecks[0]
      ? [...dealingDecks[0]]
      : [];

    if (!nextDealCards.length) {
      return;
    }

    if (scheduledDealFrameRef.current !== null) {
      cancelAnimationFrame(scheduledDealFrameRef.current);
    }

    pendingRemovalTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    pendingRemovalTimeoutsRef.current = [];

    setPendingDealCards(nextDealCards);
    setPendingActiveIndex(0);

    scheduledDealFrameRef.current = requestAnimationFrame(() => {
      scheduledDealFrameRef.current = null;

      updateDealDeckPosition();

      dealSound.play();

      const [returnCardDecks, returnDealingDecks] = deal(
        cardDecks,
        dealingDecks,
        cannotDealSound,
      );

      setCardDecks(returnCardDecks);
      setDealingDecks(returnDealingDecks);

      const hasDealtCards =
        returnDealingDecks.length < dealingDecks.length;

      if (!hasDealtCards) {
        pendingRemovalTimeoutsRef.current.forEach((timeoutId) => {
          clearTimeout(timeoutId);
        });
        pendingRemovalTimeoutsRef.current = [];
        setPendingDealCards([]);
        setPendingActiveIndex(0);
        return;
      }

      const newlyDealtCards = Array.from(
        { length: 10 },
        (_, index) => {
          const deck = returnCardDecks[`deck${index + 1}`];
          if (!deck || deck.cards.length === 0) {
            return undefined;
          }
          return deck.cards[deck.cards.length - 1];
        },
      ).filter(Boolean);

      triggerDealAnimation(newlyDealtCards);

      const timeouts = [];

      nextDealCards.forEach((_card, index) => {
        const startDelay = index * INITIAL_DEAL_ANIMATION_DELAY;

        const removalTimeoutId = setTimeout(() => {
          setPendingActiveIndex((previous) => {
            const targetIndex = index + 1;
            return targetIndex > previous ? targetIndex : previous;
          });

          if (index === nextDealCards.length - 1) {
            const clearTimeoutId = setTimeout(() => {
              setPendingDealCards([]);
              setPendingActiveIndex(0);
            }, INITIAL_DEAL_ANIMATION_DURATION);

            timeouts.push(clearTimeoutId);
          }
        }, startDelay);

        timeouts.push(removalTimeoutId);
      });

      pendingRemovalTimeoutsRef.current = timeouts;
    });
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
      {pendingDealCards.length ? (
        <Styled.PendingDealCards data-visible="true">
          {pendingDealCards.map((card, index) => {
            const totalCards = pendingDealCards.length;
            const isActive = index === pendingActiveIndex;
            const isQueued = index > pendingActiveIndex;
            return (
              <Styled.PendingDealCard
                key={card?.id ?? `pending-${index}`}
                $zIndex={totalCards - index}
                $isActive={isActive}
                $isQueued={isQueued}
                $isDealt={index < pendingActiveIndex}
                data-pending-card={
                  isActive
                    ? 'front'
                    : index < pendingActiveIndex
                    ? 'dealt'
                    : 'queued'
                }
              >
                <CardArtwork card={card} isClose={false} />
              </Styled.PendingDealCard>
            );
          })}
        </Styled.PendingDealCards>
      ) : null}
      {Array.from({ length: 5 }, (_, index) => {
        const positionFromRight = 5 - index;
        const shouldShow = positionFromRight <= dealingDecks.length;
        return shouldShow ? (
          <div
            key={index}
            className="card"
            data-position={index + 1}
            data-deal-measure="true"
          >
            <Card isClose />
          </div>
        ) : null;
      })}
    </Styled.DealArea>
  );
}

export default React.memo(DealArea);

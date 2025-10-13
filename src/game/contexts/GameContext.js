// Libraries
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  createContext,
} from 'react';
// Components | Utils
import { getRandomDecks } from '../utils/cardUtils';

export const GameContext = createContext();

export const INITIAL_DEAL_ANIMATION_DURATION = 360;
export const INITIAL_DEAL_ANIMATION_DELAY = 90;

const getTopCards = (decks) => {
  return Array.from({ length: 10 }, (_, index) => {
    const deck = decks[`deck${index + 1}`];
    if (!deck || deck.cards.length === 0) {
      return undefined;
    }
    return deck.cards[deck.cards.length - 1];
  }).filter(Boolean);
};

function GameContextProvider(props) {
  const { children } = props;

  const [cardDecks, setCardDecks] = useState({
    deck1: {},
    deck2: {},
    deck3: {},
    deck4: {},
    deck5: {},
    deck6: {},
    deck7: {},
    deck8: {},
    deck9: {},
    deck10: {},
  });
  const [dealingDecks, setDealingDecks] = useState([]);
  const [isAnyDragging, setIsAnyDragging] = useState(false);
  const [gameStats, setGameStats] = useState({
    completedDeckCount: 0,
    score: 500,
    moves: 0,
  });
  const [dealAnimationOrder, setDealAnimationOrder] = useState({});
  const [isDealAnimationRunning, setIsDealAnimationRunning] =
    useState(false);
  const initialDealTimerRef = useRef(null);

  const triggerDealAnimation = useCallback((cards) => {
    if (initialDealTimerRef.current) {
      clearTimeout(initialDealTimerRef.current);
    }

    if (!cards || cards.length === 0) {
      setDealAnimationOrder({});
      setIsDealAnimationRunning(false);
      return;
    }

    const orderMap = {};
    cards.forEach((card, index) => {
      if (card) {
        orderMap[card.id] = index;
      }
    });

    setDealAnimationOrder(orderMap);
    setIsDealAnimationRunning(true);

    const totalDelay =
      (cards.length - 1) * INITIAL_DEAL_ANIMATION_DELAY +
      INITIAL_DEAL_ANIMATION_DURATION;

    initialDealTimerRef.current = setTimeout(() => {
      setDealAnimationOrder({});
      setIsDealAnimationRunning(false);
      initialDealTimerRef.current = null;
    }, totalDelay);
  }, []);

  const startNewGame = useCallback(
    (newCardDecks, newDealingDecks) => {
      setCardDecks(newCardDecks);
      if (newDealingDecks) {
        setDealingDecks(newDealingDecks);
      }
      const topCards = getTopCards(newCardDecks);
      triggerDealAnimation(topCards);
    },
    [triggerDealAnimation],
  );

  /*
  ====================================================
  ================== USE EFFECT ======================
  ====================================================
  */

  useEffect(() => {
    const [cDecks, dDecks] = getRandomDecks();
    startNewGame(cDecks, dDecks);

    return () => {
      if (initialDealTimerRef.current) {
        clearTimeout(initialDealTimerRef.current);
      }
    };
  }, [startNewGame]);

  const contextValue = useMemo(
    () => ({
      cardDecks,
      setCardDecks,
      isAnyDragging,
      setIsAnyDragging,
      dealingDecks,
      setDealingDecks,
      gameStats,
      setGameStats,
      dealAnimationOrder,
      isDealAnimationRunning,
      startNewGame,
      triggerDealAnimation,
    }),
    [
      cardDecks,
      isAnyDragging,
      dealingDecks,
      gameStats,
      dealAnimationOrder,
      isDealAnimationRunning,
      startNewGame,
      triggerDealAnimation,
    ],
  );

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export default GameContextProvider;

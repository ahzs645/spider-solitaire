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
    deck1: { cards: [], visibleCardCount: 0 },
    deck2: { cards: [], visibleCardCount: 0 },
    deck3: { cards: [], visibleCardCount: 0 },
    deck4: { cards: [], visibleCardCount: 0 },
    deck5: { cards: [], visibleCardCount: 0 },
    deck6: { cards: [], visibleCardCount: 0 },
    deck7: { cards: [], visibleCardCount: 0 },
    deck8: { cards: [], visibleCardCount: 0 },
    deck9: { cards: [], visibleCardCount: 0 },
    deck10: { cards: [], visibleCardCount: 0 },
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
  const [dealDeckPosition, setDealDeckPosition] = useState({ x: 0, y: 0 });
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(true);
  const [pendingDealCards, setPendingDealCards] = useState([]);
  const initialDealTimerRef = useRef(null);

  const triggerDealAnimation = useCallback(
    (cards) => {
      if (initialDealTimerRef.current) {
        clearTimeout(initialDealTimerRef.current);
      }

      if (!cards || cards.length === 0) {
        setDealAnimationOrder({});
        setIsDealAnimationRunning(false);
        setPendingDealCards([]);
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
        setPendingDealCards([]);
        initialDealTimerRef.current = null;
      }, totalDelay);
    },
    [setPendingDealCards],
  );

  const startNewGame = useCallback(
    (newCardDecks, newDealingDecks) => {
      setCardDecks(newCardDecks);
      if (newDealingDecks) {
        setDealingDecks(newDealingDecks);
      }
      setPendingDealCards([]);
      const topCards = getTopCards(newCardDecks);
      triggerDealAnimation(topCards);
      // Reset game stats when starting new game
      setGameStats({
        completedDeckCount: 0,
        score: 500,
        moves: 0,
      });
    },
    [triggerDealAnimation, setPendingDealCards],
  );

  /*
  ====================================================
  ================== USE EFFECT ======================
  ====================================================
  */

  // Start game when difficulty is selected
  useEffect(() => {
    if (difficulty !== null) {
      const [cDecks, dDecks] = getRandomDecks(difficulty);
      startNewGame(cDecks, dDecks);
    }

    return () => {
      if (initialDealTimerRef.current) {
        clearTimeout(initialDealTimerRef.current);
      }
    };
  }, [difficulty, startNewGame]);

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
      dealDeckPosition,
      setDealDeckPosition,
      pendingDealCards,
      setPendingDealCards,
      difficulty,
      setDifficulty,
      showDifficultyDialog,
      setShowDifficultyDialog,
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
      dealDeckPosition,
      pendingDealCards,
      difficulty,
      showDifficultyDialog,
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

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

const createEmptyDeckState = () => ({
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

  const [cardDecks, setCardDecks] = useState(createEmptyDeckState());
  const [dealingDecks, setDealingDecks] = useState([]);
  const [isAnyDragging, setIsAnyDragging] = useState(false);
  const [gameStats, setGameStats] = useState({
    completedDecks: [], // Array of completed King cards
    score: 500,
    moves: 0,
  });
  const [dealAnimationOrder, setDealAnimationOrder] = useState({});
  const [isDealAnimationRunning, setIsDealAnimationRunning] =
    useState(false);
  const [dealDeckPosition, setDealDeckPosition] = useState({ x: 0, y: 0 });
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(true);
  const [showEmptySlotWarning, setShowEmptySlotWarning] = useState(false);
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
        completedDecks: [],
        score: 500,
        moves: 0,
      });
    },
    [triggerDealAnimation, setPendingDealCards],
  );

  const beginNewGame = useCallback(
    (selectedDifficulty) => {
      const [newCardDecks, newDealingDecks] =
        getRandomDecks(selectedDifficulty);

      setDifficulty(selectedDifficulty);
      startNewGame(newCardDecks, newDealingDecks);
    },
    [startNewGame],
  );

  const playToVictory = useCallback(() => {
    if (initialDealTimerRef.current) {
      clearTimeout(initialDealTimerRef.current);
      initialDealTimerRef.current = null;
    }

    setDealAnimationOrder({});
    setIsDealAnimationRunning(false);
    setPendingDealCards([]);
    setDealingDecks([]);
    setCardDecks(createEmptyDeckState());
    setGameStats((prevStats) => ({
      completedDecks: Array(8).fill({ rank: 13, suit: 'spades' }),
      score: Math.max(prevStats.score, 1000),
      moves: prevStats.moves,
    }));
    setShowDifficultyDialog(false);
  }, [setShowDifficultyDialog]);

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
      showEmptySlotWarning,
      setShowEmptySlotWarning,
      startNewGame,
      triggerDealAnimation,
      beginNewGame,
      playToVictory,
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
      showEmptySlotWarning,
      startNewGame,
      triggerDealAnimation,
      beginNewGame,
      playToVictory,
    ],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.playSpiderSolitaireToVictory = playToVictory;
      window.startSpiderSolitaireGame = beginNewGame;

      return () => {
        if (window.playSpiderSolitaireToVictory === playToVictory) {
          delete window.playSpiderSolitaireToVictory;
        }
        if (window.startSpiderSolitaireGame === beginNewGame) {
          delete window.startSpiderSolitaireGame;
        }
      };
    }

    return undefined;
  }, [playToVictory, beginNewGame]);

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

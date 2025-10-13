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

export const INITIAL_DEAL_ANIMATION_DURATION = 400;
export const INITIAL_DEAL_ANIMATION_DELAY = 70;

const buildInitialDealOrder = (decks) => {
  const orderMap = {};
  let order = 0;

  const deckList = Array.from(
    { length: 10 },
    (_, index) => decks[`deck${index + 1}`] || { cards: [] },
  );

  const maxHeight = Math.max(
    ...deckList.map((deck) => deck.cards.length),
    0,
  );

  for (let round = 0; round < maxHeight; round += 1) {
    for (
      let deckIndex = 0;
      deckIndex < deckList.length;
      deckIndex += 1
    ) {
      const deck = deckList[deckIndex];
      if (round < deck.cards.length) {
        const card = deck.cards[round];
        if (card) {
          orderMap[card.id] = order;
          order += 1;
        }
      }
    }
  }

  return orderMap;
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
  const [initialDealOrder, setInitialDealOrder] = useState({});
  const [isInitialDealComplete, setIsInitialDealComplete] =
    useState(true);
  const initialDealTimerRef = useRef(null);

  const scheduleInitialDealFinish = useCallback((cardCount) => {
    if (initialDealTimerRef.current) {
      clearTimeout(initialDealTimerRef.current);
    }

    if (cardCount === 0) {
      setIsInitialDealComplete(true);
      return;
    }

    const totalDelay =
      cardCount * INITIAL_DEAL_ANIMATION_DELAY +
      INITIAL_DEAL_ANIMATION_DURATION;

    setIsInitialDealComplete(false);
    initialDealTimerRef.current = setTimeout(() => {
      setIsInitialDealComplete(true);
      initialDealTimerRef.current = null;
    }, totalDelay);
  }, []);

  const startNewGame = useCallback(
    (newCardDecks, newDealingDecks) => {
      setCardDecks(newCardDecks);
      if (newDealingDecks) {
        setDealingDecks(newDealingDecks);
      }
      const orderMap = buildInitialDealOrder(newCardDecks);
      setInitialDealOrder(orderMap);
      scheduleInitialDealFinish(Object.keys(orderMap).length);
    },
    [scheduleInitialDealFinish],
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
      initialDealOrder,
      isInitialDealComplete,
      startNewGame,
    }),
    [
      cardDecks,
      isAnyDragging,
      dealingDecks,
      gameStats,
      initialDealOrder,
      isInitialDealComplete,
      startNewGame,
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

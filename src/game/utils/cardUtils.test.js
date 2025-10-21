import {
  cardImages,
  cardInverseImages,
  cardCounts,
  getCardNo,
  shuffle,
  checkCompletedDeck,
  moveCards,
  deal,
  newGame,
  getIndexWhichNextCardsDraggable,
  getOrderedCardListsFromDecks,
  getHint,
} from './cardUtils';

const createCard = (rank, suit = 'spades', copy = 0) => ({
  id: `${suit}-${rank}-${copy}`,
  suit,
  rank,
});

describe('cardUtils', () => {
  HTMLMediaElement.prototype.play = jest.fn();

  describe('Constants', () => {
    it('should map ranks to static image assets', () => {
      const suitNameMap = {
        spades: 'Spades',
        hearts: 'Hearts',
        clubs: 'Clubs',
        diamonds: 'Diamonds',
      };
      const rankAssetNames = {
        1: 'Ace',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: 'Jack',
        12: 'Queen',
        13: 'King',
      };

      Object.entries(cardImages).forEach(([suit, ranks]) => {
        Object.entries(ranks).forEach(([rank, assetPath]) => {
          const expectedFragment = `${rankAssetNames[rank]}_${suitNameMap[suit]}`;
          expect(assetPath).toMatch(
            new RegExp(`${expectedFragment}.*\\.png$`)
          );
        });
      });
    });

    it('should map ranks to inverse hint assets', () => {
      const suitNameMap = {
        spades: 'Spades',
        hearts: 'Hearts',
        clubs: 'Clubs',
        diamonds: 'Diamonds',
      };
      const rankAssetNames = {
        1: 'Ace',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: 'Jack',
        12: 'Queen',
        13: 'King',
      };

      Object.entries(cardInverseImages).forEach(([suit, ranks]) => {
        Object.entries(ranks).forEach(([rank, assetPath]) => {
          const expectedFragment = `${rankAssetNames[rank]}_${suitNameMap[suit]}_Inverse`;
          expect(assetPath).toMatch(
            new RegExp(`${expectedFragment}.*\\.png$`)
          );
        });
      });
    });

    it('should be 8 of each card no when initial state', () => {
      Object.values(cardCounts).forEach((count) => {
        expect(count).toBe(8);
      });
    });
  });

  describe('getCardNo()', () => {
    it('should return correct card no when given name', () => {
      expect(getCardNo('king')).toBe(13);
    });
  });

  describe('shuffle()', () => {
    it('should return shuffled list', () => {
      const cards = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(shuffle(cards)).not.toEqual(cards);
    });
  });

  describe('checkCompletedDeck()', () => {
    it('should return true if deck contains a full descending suited run', () => {
      const leadingCards = [
        createCard(9, 'hearts', 0),
        createCard(8, 'hearts', 0),
      ];
      const fullRun = Array.from({ length: 13 }, (_, index) =>
        createCard(13 - index, 'spades', index)
      );
      expect(checkCompletedDeck([...leadingCards, ...fullRun])).toBeTruthy();
    });

    it('should return false if deck does not contain a suited run', () => {
      const cards = Array.from({ length: 13 }, (_, index) =>
        createCard(13 - index, index % 2 === 0 ? 'spades' : 'hearts', index)
      );
      expect(checkCompletedDeck(cards)).toBeFalsy();
    });
  });

  describe('moveCards()', () => {
    it('should move a suited descending stack onto a matching parent', () => {
      const cardDecks = {
        deck1: {
          cards: [
            createCard(9, 'spades', 0),
            createCard(8, 'spades', 0),
            createCard(7, 'spades', 0),
          ],
          visibleCardCount: 3,
        },
        deck2: {
          cards: [createCard(10, 'spades', 0)],
          visibleCardCount: 1,
        },
      };
      const source = {
        index: 0,
        droppableId: 'deck1',
      };
      const destination = {
        index: cardDecks.deck2.cards.length,
        droppableId: 'deck2',
      };

      const result = moveCards(cardDecks, source, destination);

      expect(result.isDragSuccessful).toBeTruthy();
      expect(result.newCardDecks.deck2.cards.map((card) => card.rank)).toEqual([
        10, 9, 8, 7,
      ]);
    });

    it('should allow stacking on a different suit when rank matches', () => {
      const cardDecks = {
        deck1: {
          cards: [
            createCard(9, 'hearts', 0),
            createCard(8, 'hearts', 0),
          ],
          visibleCardCount: 2,
        },
        deck2: {
          cards: [createCard(10, 'spades', 0)],
          visibleCardCount: 1,
        },
      };
      const source = {
        index: 0,
        droppableId: 'deck1',
      };
      const destination = {
        index: cardDecks.deck2.cards.length,
        droppableId: 'deck2',
      };

      const result = moveCards(cardDecks, source, destination);

      expect(result.isDragSuccessful).toBeTruthy();
      expect(result.newCardDecks.deck2.cards.map((card) => card.rank)).toEqual([
        10, 9, 8,
      ]);
    });

    it('should not move stack when dragged cards break suited sequence', () => {
      const cardDecks = {
        deck1: {
          cards: [
            createCard(9, 'hearts', 0),
            createCard(8, 'spades', 0),
          ],
          visibleCardCount: 2,
        },
        deck2: {
          cards: [createCard(10, 'clubs', 0)],
          visibleCardCount: 1,
        },
      };
      const source = {
        index: 0,
        droppableId: 'deck1',
      };
      const destination = {
        index: cardDecks.deck2.cards.length,
        droppableId: 'deck2',
      };

      const result = moveCards(cardDecks, source, destination);

      expect(result.isDragSuccessful).toBeFalsy();
      expect(result.newCardDecks.deck2.cards.map((card) => card.rank)).toEqual([10]);
    });
  });

  describe('deal()', () => {
    it('should add one card to each deck when dealing is allowed', () => {
      const cardDecks = {
        deck1: {
          cards: [createCard(9, 'spades', 0)],
          visibleCardCount: 1,
        },
        deck2: {
          cards: [createCard(10, 'spades', 0)],
          visibleCardCount: 1,
        },
      };

      const dealingCards = [
        [createCard(8, 'spades', 1), createCard(7, 'spades', 1)],
      ];

      const [newDecks] = deal(cardDecks, dealingCards);

      expect(newDecks.deck1.cards).toHaveLength(2);
      expect(newDecks.deck2.cards).toHaveLength(2);
    });
  });

  describe('newGame()', () => {
    it('should return initial decks', () => {
      expect(newGame()).not.toBeNull();
    });
  });

  describe('getIndexWhichNextCardsDraggable()', () => {
    it('should return first index of descending suited run', () => {
      const deck = {
        cards: [
          createCard(12, 'spades', 0),
          createCard(11, 'spades', 0),
          createCard(10, 'spades', 0),
          createCard(9, 'hearts', 0),
          createCard(8, 'hearts', 0),
        ],
        visibleCardCount: 4,
      };

      expect(getIndexWhichNextCardsDraggable(deck)).toBe(3);
    });
  });

  describe('getOrderedCardListsFromDecks()', () => {
    it('should return ordered card lists from decks', () => {
      const cardDecks = {
        deck1: {
          cards: [
            createCard(12, 'spades', 0),
            createCard(11, 'spades', 0),
            createCard(10, 'spades', 0),
            createCard(9, 'spades', 0),
          ],
          visibleCardCount: 4,
        },
        deck2: {
          cards: [
            createCard(7, 'hearts', 0),
            createCard(6, 'hearts', 0),
            createCard(5, 'hearts', 0),
          ],
          visibleCardCount: 3,
        },
      };

      const orderedCardLists =
        getOrderedCardListsFromDecks(cardDecks);

      expect(orderedCardLists).toEqual([
        {
          cards: cardDecks.deck1.cards,
          startingIndex: 0,
        },
        {
          cards: cardDecks.deck2.cards,
          startingIndex: 0,
        },
      ]);
    });
  });

  describe('getHint()', () => {
    it('should return undefined if no hint', () => {
      const cardDecks = {
        deck1: {
          cards: [
            createCard(9, 'spades', 0),
            createCard(8, 'spades', 0),
          ],
          visibleCardCount: 2,
        },
        deck2: {
          cards: [createCard(7, 'hearts', 0)],
          visibleCardCount: 1,
        },
      };

      expect(getHint(cardDecks)).toBeUndefined();
    });

    it('should return a hint when a valid move exists', () => {
      const cardDecks = {
        deck1: {
          cards: [
            createCard(9, 'spades', 0),
            createCard(8, 'spades', 0),
          ],
          visibleCardCount: 2,
        },
        deck2: {
          cards: [createCard(10, 'spades', 0)],
          visibleCardCount: 1,
        },
      };

      const hint = getHint(cardDecks);

      expect(hint).toBeDefined();
      expect(hint.sourceDeckId).toBe('deck1');
      expect(hint.destinationDeckId).toBe('deck2');
    });
  });
});

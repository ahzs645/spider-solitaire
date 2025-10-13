import React from 'react';
import { render } from '@testing-library/react';
import Card from '.';
import { GameContext } from '../../../contexts/GameContext';

const renderWithGameContext = (ui, value = {}) => {
  const defaultValue = {
    dealAnimationOrder: {},
    isDealAnimationRunning: false,
    startNewGame: jest.fn(),
    triggerDealAnimation: jest.fn(),
  };

  return render(
    <GameContext.Provider value={{ ...defaultValue, ...value }}>
      {ui}
    </GameContext.Provider>
  );
};

describe('Card Components', () => {
  HTMLMediaElement.prototype.play = jest.fn();

  it('should render face-up card using png artwork', () => {
    const card = { id: 'spades-13-0', suit: 'spades', rank: 13 };
    const { container } = renderWithGameContext(<Card card={card} />);
    expect(container.querySelector('img').src).toMatch(
      /King_Spades.*\.png$/
    );
  });

  it('should render card back when closed', () => {
    const { container } = renderWithGameContext(<Card isClose />);
    expect(container.querySelector('img')).not.toBeNull();
  });
});

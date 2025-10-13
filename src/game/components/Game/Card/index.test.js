import React from 'react';
import { render } from '@testing-library/react';
import Card from '.';

describe('Card Components', () => {
  HTMLMediaElement.prototype.play = jest.fn();

  it('should render face-up card using png artwork', () => {
    const card = { id: 'spades-13-0', suit: 'spades', rank: 13 };
    const { container } = render(<Card card={card} />);
    expect(container.querySelector('img').src).toMatch(
      /King_Spades.*\.png$/
    );
  });

  it('should render card back when closed', () => {
    const { container } = render(<Card isClose />);
    expect(container.querySelector('img')).not.toBeNull();
  });
});

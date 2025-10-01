import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import GameContextProvider from '../../contexts/GameContext';
import { theme } from '../../../globalStyles';
import SolitaireGame from '.';

describe('SolitaireGame Screen', () => {
  it('should be render', () => {
    const { container } = render(
      <GameContextProvider>
        <ThemeProvider theme={theme}>
          <SolitaireGame />
        </ThemeProvider>
      </GameContextProvider>
    );

    expect(container.innerHTML).not.toEqual('');
  });
});

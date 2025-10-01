import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import WindowMenu from '.';
import { theme } from '../../../globalStyles';
import GameContextProvider from '../../contexts/GameContext';

describe('WindowMenu Components', () => {
  HTMLMediaElement.prototype.play = jest.fn();

  it('should be render', () => {
    const { container } = render(
      <GameContextProvider>
        <ThemeProvider theme={theme}>
          <WindowMenu />
        </ThemeProvider>
      </GameContextProvider>
    );

    expect(container.innerHTML).not.toEqual('');
  });
});

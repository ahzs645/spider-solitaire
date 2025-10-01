import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import DraggingContextProvider from '../../../contexts/DraggingContext';
import { theme } from '../../../../globalStyles';
import GameContextProvider from '../../../contexts/GameContext';
import HintArea from '.';
import HintContextProvider from '../../../contexts/HintContext';

describe('HintArea Components', () => {
  it('should be render', () => {
    HTMLMediaElement.prototype.play = jest.fn();

    const { container } = render(
      <GameContextProvider>
        <HintContextProvider>
          <DraggingContextProvider>
            <ThemeProvider theme={theme}>
              <HintArea />
            </ThemeProvider>
          </DraggingContextProvider>
        </HintContextProvider>
      </GameContextProvider>
    );

    expect(container.innerHTML).not.toEqual('');
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../globalStyles';
import GameOver from '.';

describe('GameOver Components', () => {
  it('should be render', () => {
    HTMLMediaElement.prototype.play = jest.fn();

    const { container } = render(
      <ThemeProvider theme={theme}>
        <GameOver />
      </ThemeProvider>
    );

    expect(container.innerHTML).not.toEqual('');
  });
});

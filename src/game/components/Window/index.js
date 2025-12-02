// Libraries
import React from 'react';
// Components | Utils
import WindowMenu from '../WindowMenu';
import StatusBar from '../StatusBar';
// Assets
import * as Styled from './styles';

const Window = (props) => {
  const { children } = props;

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return (
    <Styled.Window>
      <WindowMenu />
      <Styled.WindowBody>{children}</Styled.WindowBody>
      <StatusBar />
    </Styled.Window>
  );
};

export default Window;

// Libraries
import React from 'react';
// Components | Utils
import WindowMenu from '../WindowMenu';
// Assets
import * as Styled from './styles';
import SolitaireIcon from '../../../assets/images/solitaire-icon.webp';

const Window = (props) => {
  const { children, title } = props;

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return (
    <Styled.Window>
      <Styled.TitleBar>
        <img src={SolitaireIcon} alt="solitaire icon" />
        <span>{title}</span>
      </Styled.TitleBar>
      <WindowMenu />
      <Styled.WindowBody>{children}</Styled.WindowBody>
    </Styled.Window>
  );
};

export default Window;

// Libraries
import React from 'react';
// Components | Utils
import WindowMenu from '../WindowMenu';
import StatusBar from '../StatusBar';
// Assets
import * as Styled from './styles';

// Check if running in embedded mode (inside iframe or with ?embedded=true)
const isEmbedded = () => {
  try {
    // Check URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('embedded') === 'true') return true;
    // Check if in iframe
    if (window.self !== window.top) return true;
  } catch (e) {
    // If we can't access window.top due to cross-origin, we're in an iframe
    return true;
  }
  return false;
};

const Window = (props) => {
  const { children } = props;
  const embedded = isEmbedded();

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return (
    <Styled.Window>
      {!embedded && <WindowMenu />}
      <Styled.WindowBody>{children}</Styled.WindowBody>
      {!embedded && <StatusBar />}
    </Styled.Window>
  );
};

export default Window;

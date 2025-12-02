// Libraries
import styled from 'styled-components';

export const Window = styled.div`
  background-color: ${(props) => props.theme.colors.xpWindowBg};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  z-index: 2;
`;

export const TitleBar = styled.div`
  align-items: center;
  background: ${(props) => props.theme.gradients.titleBarBg};
  color: ${(props) => props.theme.colors.titleBarText};
  display: flex;
  font-family: 'Trebuchet MS';
  font-size: 13px;
  padding: 6px;

  img {
    height: 100%;
  }
`;

export const WindowBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

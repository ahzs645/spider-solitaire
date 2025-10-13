// Libraries
import styled from 'styled-components';

export const Window = styled.div`
  background-color: ${(props) => props.theme.colors.xpWindowBg};
  display: grid;
  grid-template-rows: 20px 1fr;
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
  height: 100%;
`;

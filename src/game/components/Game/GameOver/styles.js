// Libraries
import styled from 'styled-components';
// Components | Utils
import {
  XPWrapper as BaseXPWrapper,
  SmallButton as BaseSmallButton,
} from '../DifficultyDialog/styles';

export const WinScreen = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(72px, 9vw, 110px);
  font-weight: bold;
  color: ${(props) => props.theme.colors.titleBarText};
  animation: ${(props) => props.theme.keyFrames.colorChange} 8s infinite;
  pointer-events: none;
  z-index: 10000;
`;

export const Overlay = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10001;
  pointer-events: none;
`;

export const XPWrapper = styled(BaseXPWrapper)`
  pointer-events: auto;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;

  p {
    margin: 0;
    line-height: 1.45;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PrimaryButton = styled(BaseSmallButton)`
  min-width: 96px;
`;

// Libraries
import styled from 'styled-components';
// Components | Utils
import {
  XPWrapper as BaseXPWrapper,
  SmallButton as BaseSmallButton,
} from '../DifficultyDialog/styles';

export const WinScreen = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 42px;
  font-weight: bold;
  color: #fffbe6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
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

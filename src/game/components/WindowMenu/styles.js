// Libraries
import styled from 'styled-components';
// Assets
import { styledComponents } from '../../../globalStyles';

export const Menu = styled.div`
  background-color: #ece9d8;
  display: flex;
  font-size: 11px;
`;

export const MenuItem = styled.div`
  display: flex;
  padding: 3px 5px;
  position: relative;

  &:hover > button:not(:disabled) {
    background-color: #316ac5;

    color: white;
  }

  &:hover > button:not(:disabled) + div {
    display: flex;
  }
`;

export const MenuButton = styled(styledComponents.Button)`
  background: transparent;
  border: 0;
  box-shadow: none;
  color: black;
  font-size: 11px;
  min-height: 0;
  min-width: 0;
  padding: 2px 6px;
  text-align: left;

  &:active,
  &.active {
    box-shadow: none;
  }

  &:focus,
  &:focus-visible,
  &.focused {
    outline: none;
    outline-offset: 0;
  }

  &:disabled {
    color: rgba(0, 0, 0, 0.35);
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const MenuContent = styled.div`
  background-color: white;
  border: 1px solid gray;
  display: none;
  flex-direction: column;
  left: 0;
  padding: 1px;
  position: absolute;
  top: 20px;
  width: 200px;
  z-index: 5;
`;

export const SubMenuButton = styled(styledComponents.Button)`
  background: transparent;
  border: 0;
  box-shadow: none;
  color: black;
  font-size: 11px;
  min-height: 0;
  min-width: 0;
  padding: 2px 2px 4px 12px;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: #316ac5;
    color: white;
  }

  &:active,
  &.active {
    box-shadow: none;
  }

  &:focus,
  &:focus-visible,
  &.focused {
    outline: none;
    outline-offset: 0;
  }
`;

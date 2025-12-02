// Libraries
import styled from 'styled-components';

export const MenuBarContainer = styled.div`
  background: #e9e9e9;
  box-sizing: border-box;
  width: 100%;
  z-index: 30;
  position: relative;
`;

export const MenuBar = styled.div`
  align-items: center;
  background: #e9e9e9;
  border-bottom: 2px solid #e0e0e0;
  box-sizing: border-box;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  font-family: Tahoma, Arial, sans-serif;
  font-size: 11px;
  height: 22px;
  max-height: 22px;
  min-height: 22px;
  overflow: hidden;
  padding: 0 8px 0 0;
  position: relative;
  user-select: none;
`;

export const MenuItem = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  height: 100%;
  justify-content: center;
  max-width: fit-content;
  padding: 0 12px;
  text-align: center;
  cursor: default;

  &.active,
  &:not(.disabled):hover {
    background: #0a6fc2;
    color: #fff;
  }

  &.disabled {
    color: #bcbcbc;
    cursor: default;
  }

  &.disabled:hover {
    background: none;
    border: none;
    box-shadow: none;
    color: #bcbcbc;
    outline: none;
  }
`;

export const MenuBarLogo = styled.img`
  background: none;
  border-radius: 0;
  display: block;
  height: 100%;
  margin-left: 0;
  object-fit: contain;
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  z-index: 2;
`;

export const MenuBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
`;

export const DropdownMenu = styled.div`
  background: #f2f2f2;
  border: 1px solid #d0d0d0;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  font-family: Tahoma, Arial, sans-serif;
  font-size: 11px;
  margin-top: 0;
  padding: 2px 0;
  position: absolute;
  left: 0;
  top: 22px;
  min-width: 160px;
  z-index: 99999;
`;

export const MenuOption = styled.div`
  background: none;
  border: none;
  box-sizing: border-box;
  display: block;
  font-family: inherit;
  font-size: inherit;
  padding: 2px 10px 2px 24px;
  text-align: left;
  transition: background 0.13s;
  white-space: nowrap;
  width: 100%;
  cursor: default;

  &:hover:not(.disabled) {
    background: #0a6fc2;
    color: #fff;
  }

  &.disabled {
    color: #bcbcbc;
  }
`;

export const MenuSeparator = styled.div`
  border-top: 1px solid #e0e0e0;
  height: 0;
  margin: 2px 0;
`;

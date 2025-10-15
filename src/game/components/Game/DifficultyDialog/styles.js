// Libraries
import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

export const XPWrapper = styled.div`
  /* Override the global styles that conflict with XP.css */
  & *,
  & *::before,
  & *::after {
    box-sizing: border-box !important;
    font-family: Arial, sans-serif !important;
    user-select: auto !important;
  }

  /* Force correct font sizing for XP.css */
  & .window,
  & .window *,
  & .window-body,
  & .window-body *,
  & .title-bar,
  & .title-bar *,
  & .field-row,
  & .field-row *,
  & button,
  & input,
  & label,
  & p {
    font-size: 11px !important;
    line-height: normal !important;
  }

  & button {
    padding: 0 !important;
  }
`;

export const SuitIcon = styled.img`
  height: 12px;
  width: auto;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  vertical-align: middle;
  display: inline-block;
`;

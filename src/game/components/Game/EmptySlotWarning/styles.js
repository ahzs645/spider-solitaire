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
  --sans-serif: 'Tahoma', 'Microsoft Sans Serif', 'Segoe UI', Arial, sans-serif;
  font-family: var(--sans-serif);
  font-size: 11px;

  /* Reset the app-wide resets so XP.css can apply its own look */
  & *,
  & *::before,
  & *::after {
    box-sizing: content-box;
    font-family: inherit;
    user-select: text;
    letter-spacing: normal;
  }

  & button,
  & input,
  & label,
  & p {
    font-size: inherit;
    line-height: normal;
  }
`;

export const SmallButton = styled.button`
  min-width: 74px;
  height: 26px;
  padding: 0 10px;
  font-size: 12px;
  line-height: 26px;
`;

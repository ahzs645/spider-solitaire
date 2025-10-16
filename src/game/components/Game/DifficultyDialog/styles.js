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

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transform: translateX(-52px);
`;

export const OptionRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 24px 20px 1fr;
  align-items: center;
  column-gap: 6px;
  width: max-content;
  margin: 0 auto;
`;

export const IconColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 4px;
`;

export const SuitGroupWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
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

export const LabelWrapper = styled.label`
  cursor: pointer;
  white-space: nowrap;
`;

export const SmallButton = styled.button`
  min-width: 74px;
  height: 26px;
  padding: 0 10px;
  font-size: 12px;
  line-height: 26px;
`;

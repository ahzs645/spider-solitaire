// Libraries
import styled from 'styled-components';

export const Deck = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${(props) => props.$deckLength + 5},
    min(16px, 2.5vw)
  );
  height: fit-content;
  justify-self: center;
  max-width: 71px;
  position: relative;
  width: 100%;

  @media (min-width: ${(props) =>
      props.theme.breakpoints.smallTablet}) {
    grid-template-rows: repeat(
      ${(props) => props.$deckLength + 5},
      min(17px, 3vh)
    );
  }
`;

export const Placeholder = styled.div`
  border-radius: 4px;
  display: grid;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;

  & > * {
    grid-area: 1/1;
  }
`;

export const EmptyCardImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

export const CardContainer = styled.div`
  z-index: 1;
`;

// Libraries
import styled from 'styled-components';

export const DeckArea = styled.div`
  display: grid;
  gap: 0.4vw;
  grid-template-columns: repeat(10, 1fr);
  justify-content: space-evenly;
  padding: 0 0.9vw;

  .card {
    height: 100%;
    width: auto;

    img {
      height: auto;
      width: 100%;
    }
  }

  @media (min-width: ${(props) =>
      props.theme.breakpoints.smallTablet}) {
    grid-template-rows: 1fr;
  }
`;

export const CardDeckContainer = styled.div`
  height: fit-content;
`;

export const DragOverlayColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${(props) => props.$cardCount + 5},
    min(16px, 2.5vw)
  );
  height: fit-content;
  justify-self: center;
  max-width: 71px;
  pointer-events: none;
  position: relative;
  width: 100%;

  @media (min-width: ${(props) =>
      props.theme.breakpoints.smallTablet}) {
    grid-template-rows: repeat(
      ${(props) => props.$cardCount + 5},
      min(17px, 3vh)
    );
  }
`;

export const DragOverlayPlaceholder = styled.div`
  border-radius: 4px;
  box-shadow: ${(props) => props.theme.boxShadows.emptyDeck};
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

export const DragOverlayCard = styled.div`
  height: 100%;
  width: auto;

  img {
    height: auto;
    width: 100%;
  }
`;

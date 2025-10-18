// Libraries
import styled, { keyframes } from 'styled-components';

const flyAnimation = (startX, startY, endX, endY) => keyframes`
  0% {
    left: ${startX}px;
    top: ${startY}px;
  }
  100% {
    left: ${endX}px;
    top: ${endY}px;
  }
`;

export const FlyingCardWrapper = styled.div`
  position: fixed;
  width: ${(props) => props.$cardWidth}px;
  height: ${(props) => props.$cardHeight}px;
  z-index: 10000;
  pointer-events: none;
  animation: ${(props) =>
      flyAnimation(props.$startX, props.$startY, props.$endX, props.$endY)}
    400ms ease-in-out forwards;
  animation-delay: ${(props) => props.$delay}ms;
  left: ${(props) => props.$startX}px;
  top: ${(props) => props.$startY}px;

  img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
`;

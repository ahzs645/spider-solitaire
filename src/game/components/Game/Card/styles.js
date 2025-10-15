// Libraries
import styled, { css, keyframes } from 'styled-components';
import { INITIAL_DEAL_ANIMATION_DURATION } from '../../../contexts/GameContext';

// Dynamic keyframes based on calculated offset from deal deck to card position
const getInitialDealKeyframes = (offsetX, offsetY) => keyframes`
  0% {
    transform: translate3d(${offsetX}px, ${offsetY}px, 0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

export const CardContainer = styled.div`
  z-index: 1;
  position: relative;
  ${(props) =>
    props.$initialDealActive &&
    css`
      animation: ${getInitialDealKeyframes(props.$animationOffsetX, props.$animationOffsetY)}
        ${INITIAL_DEAL_ANIMATION_DURATION}ms ease-out forwards;
      animation-delay: ${props.$initialDealDelay}ms;
      animation-fill-mode: both;
      will-change: transform, opacity;
    `}
`;

export const CardImage = styled.img`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
  display: block;
  height: auto;
  width: 100%;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

export const CardBackImage = styled.img`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
  display: block;
  height: auto;
  width: 100%;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

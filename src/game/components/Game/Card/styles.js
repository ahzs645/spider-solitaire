// Libraries
import styled, { css, keyframes } from 'styled-components';
import { INITIAL_DEAL_ANIMATION_DURATION } from '../../../contexts/GameContext';

const initialDeal = keyframes`
  0% {
    transform: translate3d(260px, 260px, 0);
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
      animation: ${initialDeal} ${INITIAL_DEAL_ANIMATION_DURATION}ms
        ease-out forwards;
      animation-delay: ${props.$initialDealDelay}ms;
      animation-fill-mode: both;
      will-change: transform, opacity;
    `}
`;

export const CardImage = styled.img`
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
  display: block;
  height: auto;
  width: 100%;
`;

export const CardBackImage = styled.img`
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
  display: block;
  height: auto;
  width: 100%;
`;

// Libraries
import styled from 'styled-components';
// Assets
import ClickableCursor from '../../../../assets/cursors/clickable.cur';

export const DealArea = styled.div`
  cursor: ${(props) =>
    props.$dealingDecksLength > 0 &&
    `url(${ClickableCursor}), pointer`};
  display: block;
  height: 100%;
  width: 150px;
  position: relative;

  @media (min-width: ${(props) =>
      props.theme.breakpoints.smallTablet}) {
    width: 180px;
  }

  .card {
    position: absolute;
    height: 100%;

    &[data-position="1"] {
      left: 0px;
      z-index: 5;
    }

    &[data-position="2"] {
      left: 15px;
      z-index: 4;
    }

    &[data-position="3"] {
      left: 30px;
      z-index: 3;
    }

    &[data-position="4"] {
      left: 45px;
      z-index: 2;
    }

    &[data-position="5"] {
      left: 60px;
      z-index: 1;
    }

    @media (min-width: ${(props) =>
        props.theme.breakpoints.smallTablet}) {
      &[data-position="1"] {
        left: 0px;
      }

      &[data-position="2"] {
        left: 20px;
      }

      &[data-position="3"] {
        left: 40px;
      }

      &[data-position="4"] {
        left: 60px;
      }

      &[data-position="5"] {
        left: 80px;
      }
    }

    img {
      height: 100%;
      width: auto;
    }
  }
`;

export const PendingDealCards = styled.div`
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 10;
`;

export const PendingDealCard = styled.div`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: auto;
  z-index: ${(props) => 10 + props.$zIndex};
  opacity: ${(props) => (props.$isDealt ? 0 : 1)};
  transition: none;

  img {
    height: 100%;
    width: auto;
  }
`;

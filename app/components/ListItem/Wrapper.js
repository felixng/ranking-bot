import styled from 'styled-components';

const Wrapper = styled.li`
  position: relative;
  z-index: 1;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  counter-increment: leaderboard;
  padding: 18px 10px 18px 50px;
  cursor: pointer;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1.0, 1.0);

  &::before {
    content: counter(leaderboard);
    position: absolute;
    z-index: 2;
    top: 15px;
    left: 15px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: #c24448;
    background: #fff;
    border-radius: 20px;
    text-align: center;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fa6855;
    box-shadow: 0 3px 0 rgba(0, 0, 0, .08);
    // transform: scaleX(1.06) scaleY(1.03);
    transition: all .1s ease-in-out;
    opacity: 0;
  }

  &:nth-child(1) {
    background: #fa6855;
    &::after {
      background: #fa6855;
    }
  }

  &:nth-child(2) {
    background: #e0574f;
    &::after {
      background: #e0574f;
      box-shadow: 0 2px 0 rgba(0, 0, 0, .08);
    }

    & mark {
      &::before, &::after {
        border-top: 6px solid #ba4741;
        bottom: -7px;
      }
    }
  }

  &:nth-child(3) {
    background: #d7514d;
    &::after {
      background: #d7514d;
      box-shadow: 0 1px 0 rgba(0, 0, 0, .11);
    }

    & mark {
      &::before, &::after {
        border-top: 2px solid #b0433f;
        bottom: -3px;
      }
    }
  }

  &:nth-child(4) {
    background: #cd4b4b;
    &::after {
      background: #cd4b4b;
      box-shadow: 0 -1px 0 rgba(0, 0, 0, .15);
    }

    & mark {
      &::before, &::after {
        top: -7px;
        bottom: auto;
        border-top: none;
        border-bottom: 6px solid #a63d3d;;
      }
    }
  }

  &:nth-child(5) {
    background: #c24448;
    border-radius: 0 0 10px 10px;
    &::after {
      background: #c24448;
      box-shadow: 0 -2.5px 0 rgba(0, 0, 0, .12);
      border-radius: 0 0 10px 10px;
    }

    & mark {
      &::before, &::after {
        top: -9px;
        bottom: auto;
        border-top: none;
        border-bottom: 8px solid #993639;
      }
    }
  }

}
`;

export default Wrapper;

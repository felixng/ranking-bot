import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: space-between;

  show {
  	position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 18px 10px 18px 50px;
    margin: 0;
    background: none;
    color: #fff;

    &::before, &::after {
      content: '';
      position: absolute;
      z-index: 1;
      bottom: -11px;
      left: -9px;
      border-top: 10px solid #c24448;
      border-left: 10px solid transparent;
      transition: all .1s ease-in-out;
      opacity: 0;
    }

    &::after {
      left: auto;
      right: -9px;
      border-left: none;
      border-right: 10px solid transparent;
    }
  }
`;

export default Wrapper;

import React, { PropTypes } from 'react';
import styled, { keyframes } from 'styled-components';

const circleFadeDelay = keyframes`
  0%,
  39%,
  100% {
    opacity: 0;
  }

  40% {
    opacity: 1;
  }
`;

const Circle = (props) => {
  const CirclePrimitive = styled.div`
    width: 20%;
    height: 20%;
    position: absolute;
    top:0%;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    ${props.rotate && `
      -webkit-transform: rotate(${props.rotate}deg);
      -ms-transform: rotate(${props.rotate}deg);
      transform: rotate(${props.rotate}deg);
    `}

    &:before {
      content: '';
      display: block;
      margin: 0 auto;
      width: 1.25em;
      height: 1.25em;
      background-color: #e5e5e5;
      border-radius: 100%;
      animation: ${circleFadeDelay} 1.2s infinite ease-in-out;
      ${props.delay && `
        -webkit-animation-delay: ${props.delay}s;
        animation-delay: ${props.delay}s;
      `}
    }
  `;
  return <CirclePrimitive />;
};

Circle.propTypes = {
  delay: PropTypes.number,
  rotate: PropTypes.number,
};

export default Circle;

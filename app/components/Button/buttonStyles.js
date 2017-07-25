import { css } from 'styled-components';

const buttonStyles = css`
  display: inline-block;
  box-sizing: border-box;
  padding: 0.75em 2em;
  text-decoration: none;
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  border: 2px solid #ffffff;
  color: #ffffff;

  &:active {
    background: #f39264;
    color: #fff;
  }

  @media (max-width: 400px) {
    padding: 0.5em 1em;
  }
`;

export default buttonStyles;

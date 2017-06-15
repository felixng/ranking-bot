import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background: radial-gradient(ellipse farthest-corner at center top, #f39264 0%, #f2606f 100%);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow: auto;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    color: #fff;
    position: relative;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

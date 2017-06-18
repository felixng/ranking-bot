import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    position: absolute;
    height: 100%;
    width: 100%;
    background: radial-gradient(ellipse farthest-corner at center top, #f39264 0%, #f2606f 100%);
    color: #fff;
    overflow: auto;
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

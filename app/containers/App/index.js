/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';
import withProgressBar from 'components/ProgressBar';

const AppContainer = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const AppWrapper = styled.div`
  margin: 0;
  font-family: 'Open Sans', sans-serif;  
`;

export function App(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - West End League - What's Trending in West End?"
        defaultTitle="West End League - What's Trending in West End?"
        meta={[
          { name: 'description', content: 'West End League - Top 10 Popular West End Shows base on Tweets.' },
        ]}
      />
      <AppContainer>
        <Header />
        {React.Children.toArray(props.children)}
        <Footer />
      </AppContainer>
    </AppWrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);

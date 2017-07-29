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
`;

const AppWrapper = styled.div`
  margin: 0;
  font-family: 'Open Sans', sans-serif;  
`;

export function App(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="What's trending in the West End? - Theatre Reviews from Tweets | Theatre Chatter"
        defaultTitle="What's trending in the West End? - Theatre Reviews from Tweets | Theatre Chatter"
        meta={[
          { name: 'description', content: "What's trending in the West End? - Theatre Reviews from Tweets | Theatre Chatter"},
          { name: 'og:description', content: "What's trending in the West End? - Theatre Reviews from Tweets | Theatre Chatter"},
          { name: 'og:title', content: "What's trending in the West End? - Theatre Reviews from Tweets | Theatre Chatter"},
          { name: 'og:type', content: "website"},
        ]}
      />
      <Header />
      {React.Children.toArray(props.children)}
      <Footer />
    </AppWrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);

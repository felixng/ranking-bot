import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import A from './A';
import Img from './Img';
import H1 from '../../components/H1';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';

const HeaderWrapper = styled.div`
  margin-top: 2.5em;
`;

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <HeaderWrapper>
        <H1>
        	<Link to='/'>
        	The Most Tweeted Shows in London
        	</Link>
        </H1>
      </HeaderWrapper >
    );
  }
}

export default Header;

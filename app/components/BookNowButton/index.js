import React, { PropTypes } from 'react';
import CentreButton from './CentreButton';
import scrollToComponent from 'react-scroll-to-component';

class ScrollToTopButton extends React.PureComponent {
  render () {
      return <CentreButton href={this.props.href}
      					   target='_blank'
                           hide={this.props.hidden}>
                    {this.props.text}
             </CentreButton>;
   }
} 

ScrollToTopButton.propTypes = {
  
};

export default ScrollToTopButton;

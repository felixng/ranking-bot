import React, { PropTypes } from 'react';
import SquareButton from './SquareButton';
import scrollToComponent from 'react-scroll-to-component';

class ScrollToTopButton extends React.PureComponent {
  render () {
      return <SquareButton onClick={this.props.onClick}
                           hide={this.props.hidden}>
                <i className='fa fa-angle-up' aria-hidden="true"></i>
             </SquareButton>;
   }
} 

ScrollToTopButton.propTypes = {
  
};

export default ScrollToTopButton;

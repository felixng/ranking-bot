import React, { PropTypes } from 'react';
import CentreButton from './CentreButton';
import scrollToComponent from 'react-scroll-to-component';

class ScrollToTopButton extends React.PureComponent {
  render () {
  	let small = (<div></div>)
	if (this.props.price) {
		small = (<small>from {this.props.price}</small>)
	}
	return <CentreButton href={this.props.href}
						   target='_blank'
	                   hide={this.props.hidden}>
	            Book {this.props.title} Now
	            {small}
		   </CentreButton>;
   }
} 

ScrollToTopButton.propTypes = {
  
};

export default ScrollToTopButton;

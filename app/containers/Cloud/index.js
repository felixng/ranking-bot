import React from 'react';
import Wrapper from './Wrapper';
import Title from './Title';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { allTweetsLoaded } from '../HomePage/actions';

export class Cloud extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const ComponentToRender = this.props.component;
    let content = (<div></div>)

    // If we have items, render them
    if (this.props.items) {
      content = this.props.items.map((item, index) => (
        <ComponentToRender key={`item-${index}`} item={item} onLoaded={this.props.onMounted}/>
      ));
    } else {
      // Otherwise render a single component
      return (<ComponentToRender />);
    }

    return (
      <Wrapper name='tweetCloud'>
          <Title> {this.props.title} </Title>
          {content}
      </Wrapper>
    );
  }
}

Cloud.propTypes = {
  component: React.PropTypes.func.isRequired,
  items: React.PropTypes.array,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onMounted: () => {
      dispatch(allTweetsLoaded());
    }
  };
}

const mapStateToProps = createStructuredSelector({
});

export default connect(mapStateToProps, mapDispatchToProps)(Cloud);


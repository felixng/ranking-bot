import React from 'react';
import Wrapper from './Wrapper';

function Cloud(props) {
  const ComponentToRender = props.component;
  let content = (<div></div>)

  // If we have items, render them
  if (props.items) {
    content = props.items.map((item, index) => (
      <ComponentToRender key={`item-${index}`} item={item} />
    ));
  } else {
    // Otherwise render a single component
    return (<ComponentToRender />);
  }

  return (
    <Wrapper>
        {content}
    </Wrapper>
  );
}

Cloud.propTypes = {
  component: React.PropTypes.func.isRequired,
  items: React.PropTypes.array,
};

export default Cloud;

import React from 'react';

import Ol from './Ol';
import Wrapper from './Wrapper';
import Title from './Title';

function List(props) {
  const ComponentToRender = props.component;
  let content = (<div></div>);
  let header = (<div></div>);

  // If we have items, render them
  if (props.items) {
    content = props.items.map((item, index) => (
      <ComponentToRender key={`item-${index}`} item={item} />
    ));
  } else {
    // Otherwise render a single component
    return (<ComponentToRender />);
  }

  if (props.header) {
    header = (
      <Title>
        {/*<i className="fa fa-heart-o" aria-hidden="true"></i>*/}
        {props.header}
      </Title>)

  }

  return (
    <Wrapper>
      {header}
      <Ol>
        {content}
      </Ol>
    </Wrapper>
  );
}

List.propTypes = {
  component: React.PropTypes.func.isRequired,
  items: React.PropTypes.array,
};

export default List;

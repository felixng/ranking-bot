import React from 'react';

import Ol from './Ol';
import H2 from 'components/H2';
import Wrapper from './Wrapper';
import Title from './Title';
import TitleWrapper from './TitleWrapper';

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
      <TitleWrapper>
        <H2>What's Trending?</H2>
        {/*<i className="fa fa-heart-o" aria-hidden="true"></i>*/}
        <Title>
          {props.header}
        </Title>
      </TitleWrapper>)

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

import React from 'react';

import Item from './Item';
import Wrapper from './Wrapper';

function ListItem(props) {
  return (
    <Wrapper onClick={props.onClick} active={props.active}>
      <Item>
        {props.item}
      </Item>
    </Wrapper>
  );
}

ListItem.propTypes = {
  item: React.PropTypes.any,
};

export default ListItem;

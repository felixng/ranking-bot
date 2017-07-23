import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import Wrapper from './Wrapper';
import Icon from './Icon';
import messages from './messages';

function Footer() {
  return (
    <Wrapper>
      <section>
        <FormattedMessage {...messages.triggerMessage} />
      </section>
      <section>
        <FormattedMessage
          {...messages.authorMessage}
          values={{
            author: <A target="_blank" href="https://twitter.com/hellofelixng">
                      Felix
                      <Icon className="fa fa-twitter" aria-hidden="true"></Icon>
                    </A>
          }}
        />
      </section>
    </Wrapper>
  );
}

export default Footer;

import * as React from 'react';

import dynamic from 'next/dynamic';

// tslint:disable-next-line:variable-name
const SSRIsAStupidFeatureThatIsMoreTroubleThanItsWorth = dynamic(() => import('../components/index'), {
  ssr: false,
});

export default () => (
  <>
    <SSRIsAStupidFeatureThatIsMoreTroubleThanItsWorth />
  </>
);

import * as React from 'react';
import Head from 'next/head';

import {
  BACKGROUND_COLOR, BROADCAST_HEIGHT, BROADCAST_WIDTH,
  TEXT_ON_BACKGROUND_COLOR,
} from './size-constants';

const backgrounds = ['endless-clouds.svg', 'topography.svg'];

const directionX = Math.random() > 0.5 ? 1 : -1;
const directionY = Math.random() > 0.5 ? 1 : -1;

function randomElement<T>(items: T[]) {
  return items[Math.floor((Math.random() * items.length))];
}

const stylesheet = (<style jsx global>{`
  body,html,main,aside,footer,h1,h2 {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  @keyframes animatedBackground {
    from {
      background-position: 0 0;
    }
    to {
      background-position: ${(Math.random() * 50 + 50) * directionX}% ${(Math.random() * 50 + 50) * directionY}%;
    }
  }

  .container {
    max-width: ${BROADCAST_WIDTH}px;
    max-height: ${BROADCAST_HEIGHT}px;
    height: ${BROADCAST_HEIGHT}px;

    background: ${BACKGROUND_COLOR};
    background-image: url('/static/${randomElement(backgrounds)}');
    color: ${TEXT_ON_BACKGROUND_COLOR};

    background-position: 0px 0px;
    background-repeat: repeat-x repeat-y;
    animation: animatedBackground 120s linear infinite alternate;
  }

  .container h2 {
    filter: drop-shadow(4px 2px 4px #444);
    margin-bottom: 2px;
    font-family: Pacifico;
  }
`}</style>);

// tslint:disable-next-line:variable-name
const PageContainer: React.FunctionComponent = ({ children }) => (
  <>
    <Head>
      <link href='https://fonts.googleapis.com/css?family=Pacifico&display=swap' rel='stylesheet'></link>
    </Head>

    {stylesheet}

    <div className='container'>
      {children}
    </div>
  </>
);

export default PageContainer;
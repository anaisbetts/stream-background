import * as React from 'react';

import Head from 'next/head';

// tslint:disable-next-line:variable-name
const Color = require('color');

import { db } from './firebase';

import {
  BACKGROUND_COLOR, BROADCAST_HEIGHT, BROADCAST_WIDTH,
  FOOTER_HEIGHT, SIDEBAR_WIDTH,
  TEXT_ON_BACKGROUND_COLOR,
} from './size-constants';

import { useQuery } from './when-firebase';
import BoxWithHeader from './box-with-header';

const usernameToColorMap: Map<string, string> = new Map();
let nextHue = 0.0;
let toAdd = 1.0;

// const ACCENT_COLOR = new Color('#88619f');
// const TEXT_ON_ACCENT_COLOR = new Color('#fff');

function getColorForUser(user: string) {
  if (usernameToColorMap.has(user)) {
    return usernameToColorMap.get(user);
  }

  const ret = Color([nextHue * 360.0, 66, 50], 'hsl');
  usernameToColorMap.set(user, ret.hex());

  if (nextHue + toAdd > 1.0) {
    toAdd /= 2;
    nextHue = toAdd;
  } else {
    nextHue += toAdd;
  }

  return ret.hex();
}

function randomElement<T>(items: T[]) {
  return items[Math.floor((Math.random() * items.length))];
}

const backgrounds = ['endless-clouds.svg', 'topography.svg'];

const sidebarStylesheet = (<style jsx global>{`
  aside {
    grid-area: aside;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: ${FOOTER_HEIGHT}px;
  }

  aside h2 {
    margin-left: 8px;
    margin-top: 8px;
    font-family: Pacifico;
    z-index: 30;
  }

  .chat {
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 4px;
    margin-bottom: 4px;
    font-family: Convection, Arial;
    word-wrap: break-word;
    flex: 1 1 auto;

    background-color: ${BACKGROUND_COLOR.darken(-0.2).alpha(0.5)};
    border-radius: 6px;
    padding: 8px;
    filter: drop-shadow(4px 2px 4px #222);
    z-index: 10;
  }

  .chat ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`}</style>);

const footerStylesheet = (<style jsx>{`
  footer {
    grid-area: footer;

    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: 'Pacifico';
  }

  footer .imageList {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 6px;
    padding-bottom: 4px;

    background-color: ${BACKGROUND_COLOR.darken(-0.5).alpha(0.3)};
    filter: drop-shadow(4px 2px 4px #222);
  }

  footer img {
    margin: 0px 8px 0 8px;
    width: 24px;
  }
`}</style>);

const directionX = Math.random() > 0.5 ? 1 : -1;
const directionY = Math.random() > 0.5 ? 1 : -1;

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

  main {
    grid-area: main;
    background: magenta;
    display: flex;
    align-items: center;
    justify-content: center;
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

    display: grid;
    grid-template-columns: auto ${SIDEBAR_WIDTH}px;
    grid-template-rows: auto auto ${FOOTER_HEIGHT}px;
    grid-template-areas:
      "main chat"
      "main todo"
      "footer footer";
  }

  .container h2 {
    filter: drop-shadow(4px 2px 4px #444);
    margin-bottom: 2px;
  }
`}</style>);

const chatStylesheet = (<style jsx>{`
  ul.messages {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`}</style>);

// NB: Roll our startup time back by 10 minutes or so, which
// makes chat easier to debug
const startupTime = (Date.now()) / 1000 - 10 * 60;
const messageLimit = 20;

// tslint:disable-next-line:variable-name
const Content: React.FunctionComponent = () => {
  const theWidth = ('window' in global) ? window.outerWidth : 0;

  const query = useQuery(() => db.collection('messages').orderBy('timestamp', 'asc'));

  const messages = query ? query.docs.filter(x => x.data().timestamp.seconds > startupTime).map(x => {
    const data: any = x.data();

    return (<li key={data.timestamp}>
      <strong style={{ color: getColorForUser(data.user.username) }}>{data.user.username}</strong>: {data.message}
    </li>);
  }) : [];

  if (messages.length > messageLimit) {
    messages.splice(messages.length - messageLimit);
  }

  return (
    <>
      <Head>
        <link href='https://fonts.googleapis.com/css?family=Pacifico&display=swap' rel='stylesheet'></link>
      </Head>

      {stylesheet}
      {footerStylesheet}
      {sidebarStylesheet}
      {chatStylesheet}

      <div className='container'>
        <main>
          <h1>If you're seeing this then something bad happened!- {theWidth}</h1>
        </main>

        <BoxWithHeader title='Chat' gridId='chat'>
          <ul className='messages'>{messages}</ul>
        </BoxWithHeader>

        <BoxWithHeader title='Todo' gridId='todo'>
          <p>This is Content</p>
        </BoxWithHeader>

        <footer>
          <div style={{ marginLeft: 16 }} />
          <div className='imageList'>
            <img src='/static/github.png' style={{ marginTop: 4.5 }} />
            <img src='/static/twitch.svg' style={{ marginTop: 4.5 }} />
            <img src='/static/twitter.svg' style={{ marginTop: 4.5 }} />
          </div>

          <h2 style={{ marginLeft: 32 }}>@anaisbetts</h2>
        </footer>
      </div>
    </>
  );
};

export default () => {
  // const [authVal, setAuthVal] = useState();
  return <Content />;

  /*
  useEffect(() => {
    firebase.auth().signInWithEmailAndPassword(firebaseBotUser, firebaseBotPassword)
      .then((x: any) => {
        console.log('Logged in!');
        setAuthVal(x);
      });
}, []);

  if (authVal != null) {
    return <Content />;
  } else {
    return <p />;
}
*/
};

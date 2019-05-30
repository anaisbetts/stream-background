import * as React from 'react';

import Head from 'next/head';

import { hslToHex } from './color-utils';
import { db } from './firebase';
import { useQuery } from './when-firebase';

const SIDEBAR_WIDTH = 320;
const FOOTER_HEIGHT = 64;
const BROADCAST_WIDTH = 1920;
const BROADCAST_HEIGHT = 1080;

const usernameToColorMap: Map<string, string> = new Map();
let nextHue = 0.0;
let toAdd = 1.0;

function getColorForUser(user: string) {
  if (usernameToColorMap.has(user)) {
    return usernameToColorMap.get(user);
  }

  const ret = hslToHex(nextHue, 0.5, 0.5);
  usernameToColorMap.set(user, ret);

  if (nextHue + toAdd > 1.0) {
    toAdd /= 2;
    nextHue = toAdd;
  } else {
    nextHue += toAdd;
  }

  return ret;
}

const stylesheet = (<style jsx global>{`
  body,html,main,aside,footer,h1,h2 {
    margin: 0;
    padding: 0;
  }

  aside {
    grid-area: aside;
  }

  footer {
    grid-area: footer;

    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: 'Pacifico';
  }

  footer img {
    margin: 0px 8px 0 8px;
    width: 32px;
  }

  main {
    grid-area: main;
    background: magenta;
  }

  .container {
    max-width: ${BROADCAST_WIDTH}px;
    max-height: ${BROADCAST_HEIGHT}px;
    height: ${BROADCAST_HEIGHT}px;
    background: #eee;
    color: black;

    display: grid;
    grid-template-columns: auto ${SIDEBAR_WIDTH}px;
    grid-template-rows: auto ${FOOTER_HEIGHT}px;
    grid-template-areas:
      "main aside"
      "footer aside";
  }

  .chat {
    margin: 16px;
    font-family: Convection, Arial;
    word-wrap: break-word;
  }

  .chat ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`}</style>);

export default () => {
  const theWidth = ('window' in global) ? window.outerWidth : 0;
  const query = useQuery(() => db.collection('messages').orderBy('timestamp', 'desc').limit(25));

  const messages = query ? query.docs.map(x => {
    const data: any = x.data();
    return (<li key={data.timestamp}>
      <strong style={{ color: getColorForUser(data.user.username) }}>{data.user.username}</strong>: {data.message}
    </li>);
  }) : [];

  return (
    <>
      <Head>
        <link href='https://fonts.googleapis.com/css?family=Pacifico&display=swap' rel='stylesheet'></link>
      </Head>

      {stylesheet}

      <div className='container'>
        <main>
          <h1>Main - {theWidth}</h1>
        </main>

        <aside>
          <div className='chat'>
            <ul>{messages}</ul>
          </div>
        </aside>

        <footer>
          <div style={{ marginLeft: 24 }} />
          <img src='/static/twitch.svg' style={{ marginTop: 4.5 }} />
          <img src='/static/twitter.svg' style={{ marginTop: 4.5 }} />
          <img src='/static/github.svg' style={{ marginTop: 4.5 }} />
          <h2 style={{ marginLeft: 8 }}>anaisbetts</h2>
        </footer>
      </div>
    </>
  );
};

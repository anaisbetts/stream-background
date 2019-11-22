import * as React from 'react';
import { db } from './firebase';

import {
  BACKGROUND_COLOR, FOOTER_HEIGHT, SIDEBAR_WIDTH, BROADCAST_WIDTH, BROADCAST_HEIGHT,
} from './size-constants';

import { useQuery, useDocument } from './when-firebase';
import BoxWithHeader from './box-with-header';
import PageContainer from './page-container';

// tslint:disable-next-line:variable-name
const Color = require('color');

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
    z-index: 30;
  }

  .chat {
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 4px;
    margin-bottom: 4px;
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
    height: ${FOOTER_HEIGHT}px !important;

    display: flex;
    flex-direction: row;
    align-items: center;
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

const containerStylesheet = (<style jsx global>{`
  .container {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    height: ${BROADCAST_HEIGHT}px;
    width: ${BROADCAST_WIDTH}px;
  }

  .grid {
    display: grid;
    flex: 1 1 auto;

    grid-template-columns: auto ${SIDEBAR_WIDTH}px;
    grid-template-rows: 66% 33%;
    grid-template-areas:
      "main chat"
      "main todo"
  }

  main {
    grid-area: main;
    background: magenta;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`}</style>);

const chatStylesheet = (<style jsx>{`
  ul.messages {
    margin: 0;
    padding: 0;
    list-style-type: none;
    line-height: 1.5rem;
  }

  .messages li {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  ul.todos {
    margin: 0;
    padding: 0;
    list-style-type: none;
    line-height: 1.5rem;
  }

  .todos li {
    margin-top: 16px;
    margin-bottom: 16px;
  }
`}</style>);

const usernameToColorMap: Map<string, string> = new Map();
let nextHue = 0.0;
let toAdd = 1.0;

// const ACCENT_COLOR = new Color('#88619f');
// const TEXT_ON_ACCENT_COLOR = new Color('#fff');

function getColorForUser(user: string) {
  if (usernameToColorMap.has(user)) {
    return usernameToColorMap.get(user);
  }

  const ret = Color([nextHue * 300.0, 66, 50], 'hsl');
  console.log(`Setting ${user} to ${nextHue}!`);
  usernameToColorMap.set(user, ret.hex());

  if (nextHue + toAdd > 1.0) {
    toAdd /= 2;
    nextHue = toAdd;
  } else {
    nextHue += toAdd;
  }

  return ret.hex();
}

// NB: Roll our startup time back by 10 minutes or so, which
// makes chat easier to debug
const startupTime = (Date.now()) / 1000 - 10 * 60;
const messageLimit = 10;
const isDevMode = !!window.location.href.match(/localhost:\d+/);

const MessageList: React.FunctionComponent = () => {
  const query = useQuery(() => db.collection('messages')
    .orderBy('timestamp', 'desc')
    .limit(messageLimit));
  let messages = Array<JSX.Element>();

  if (query) {
    messages = query.docs
      .filter(x => isDevMode || x.data().timestamp.seconds > startupTime)
      .map(x => {
        const data: any = x.data();

        return (<li key={data.timestamp}>
          <strong style={{ color: getColorForUser(data.user.username) }}>{data.user.username}</strong>: {data.message}
        </li>);
      });
  }

  messages.reverse();
  return (<ul className='messages'>{messages}</ul>);
}

const FINISHED_EMOJI = "✔";
const NOT_FINISHED_EMOJI = "🔲";
const INDENT_SIZE_PX = 16;
const MAX_TODOS = 5;

const TodoList: React.FunctionComponent = () => {
  const query = useQuery(() => db.collection('todos'));
  const metadata = useDocument(() => db.doc('metadata/todoOrdering'));
  let todos = Array<JSX.Element>();

  if (query && metadata) {
    const lookup = query.docs.reduce((acc, x) => {
      acc[x.id] = x;
      return acc;
    }, {});

    const order: string[] = metadata.data()!.order;
    const docs = order.slice(0, MAX_TODOS).map(id => lookup[id]);

    todos = docs.map(x => {
      const data: any = x.data();
      const indent: number = data.indent || 0;

      return (<li key={x.id}><span style={{ marginLeft: indent * INDENT_SIZE_PX, marginRight: 6 }}>{data.completedAt != null ? FINISHED_EMOJI : NOT_FINISHED_EMOJI}</span>{data.description}</li>)
    });
  }

  return (<ul className='todos'>{todos}</ul>);
};

// tslint:disable-next-line:variable-name
const Content: React.FunctionComponent = () => {
  const theWidth = ('window' in global) ? window.outerWidth : 0;
  const bottomLink = useDocument(() => db.doc('metadata/bottomLink'));

  let bottomLinkMarkup = <></>;
  if (bottomLink && bottomLink.exists) {
    bottomLinkMarkup = <>
      <span style={{ flex: "1 1 auto" }} />
      <h2 style={{ paddingRight: 2 }}>What I am working on:</h2>
      <h2 style={{ marginLeft: 32, paddingLeft: 8, paddingRight: 8 }}>{bottomLink.data()!.text}</h2>
      <span style={{ marginRight: SIDEBAR_WIDTH }} />
    </>
  }

  return (
    <>
      {containerStylesheet}
      {sidebarStylesheet}

      <PageContainer>
        {footerStylesheet}
        {chatStylesheet}

        <div className='grid'>
          <main>
            <h1>If you're seeing this then something bad happened!- {theWidth}</h1>
          </main>

          <BoxWithHeader title='Chat' gridId='chat'>
            <MessageList />
          </BoxWithHeader>

          <BoxWithHeader title='Todo' gridId='todo'>
            <TodoList />
          </BoxWithHeader>
        </div>

        {/* TODO: WHY DO WE NEED -12?????? */}
        <footer style={{ marginTop: -12 }}>
          <div style={{ marginLeft: 16 }} />
          <div className='imageList'>
            <img src='/static/github.png' style={{ marginTop: 4.5 }} />
            <img src='/static/twitch.svg' style={{ marginTop: 4.5 }} />
            <img src='/static/twitter.svg' style={{ marginTop: 4.5 }} />
          </div>

          <h2 style={{ marginLeft: 32 }}>@anaisbetts</h2>
          {bottomLinkMarkup}
        </footer>

      </PageContainer>
    </>
  )
};

export default Content;
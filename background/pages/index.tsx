import * as React from 'react';

import Head from 'next/head';

const SIDEBAR_WIDTH = 320;
const FOOTER_HEIGHT = 64;
const BROADCAST_WIDTH = 1920;
const BROADCAST_HEIGHT = 1080;

export default () => {
  const theWidth = ('window' in global) ? window.outerWidth : 0;
  return (
    <>
      <Head>
        <link href='https://fonts.googleapis.com/css?family=Pacifico&display=swap' rel='stylesheet'></link>
      </Head>

      <div className='container'>
        <main>
          <h1>Main - {theWidth}</h1>
        </main>

        <aside>
          <iframe src='https://www.twitch.tv/embed/shroud/chat' height='100%' width='100%'>
          </iframe>
        </aside>

        <footer>
          <div style={{marginLeft: 24}} />
          <img src='/static/twitch.svg' style={{marginTop: 4.5}} />
          <img src='/static/twitter.svg' style={{marginTop: 4.5}} />
          <img src='/static/github.svg' style={{marginTop: 4.5}} />
          <h2 style={{marginLeft: 8}}>anaisbetts</h2>
        </footer>
      </div>

      <style jsx global>{`
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
    `}</style>
    </>
  );
};

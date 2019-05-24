import * as React from 'react';

const SIDEBAR_WIDTH = 256;
const FOOTER_HEIGHT = 64;
const BROADCAST_WIDTH = 1920;
const BROADCAST_HEIGHT = 1080;

export default () => {
  const theWidth = ('window' in global) ? window.outerWidth : 0;
  return (
    <>
      <div className='container'>
        <main>
          <h1>Main - {theWidth}</h1>
        </main>

        <aside>
          <h1>Sidebar</h1>
        </aside>

        <footer>
          <h1>Footer</h1>
        </footer>
      </div>

      <style jsx global>{`
      body,html,main,aside,footer,h1 {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      aside {
        grid-area: aside;
      }

      footer {
        grid-area: footer;
        border: 1px solid blue;

        display: flex;
        align-items: center;
      }

      main {
        grid-area: main;
      }

      .container {
        max-width: ${BROADCAST_WIDTH}px;
        max-height: ${BROADCAST_HEIGHT}px;
        height: ${BROADCAST_HEIGHT}px;
        background: blue;
        color: white;

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

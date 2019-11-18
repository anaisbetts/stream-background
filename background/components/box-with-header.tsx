import * as React from 'react';
import { BACKGROUND_COLOR, FOOTER_HEIGHT } from './size-constants';

// tslint:disable-next-line:variable-name
const BoxWithHeader: React.FunctionComponent<{ title: string, gridId: string }> = ({ title, gridId, children }) => (
  <>
    <style jsx>{`
      aside {
        grid-area: ${gridId};
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex: 1 1 auto;
      }

      aside h2 {
        margin-left: 8px;
        margin-top: 8px;
        font-family: Pacifico;
        z-index: 30;
      }

      .content {
        margin-left: 8px;
        margin-right: 8px;
        margin-top: 4px;
        margin-bottom: 4px;
        font-family: Convection, Arial;
        word-wrap: break-word;

        background-color: ${BACKGROUND_COLOR.darken(-0.2).alpha(0.5)};
        border-radius: 6px;
        padding: 8px;
        filter: drop-shadow(4px 2px 4px #222);
        z-index: 10;
        flex: 1 1 auto;
      }
    `}</style>

    <aside>
      <h2>{title}</h2>
      <div className='content'>
        {children}
      </div>
    </aside>
  </>
);

export default BoxWithHeader;

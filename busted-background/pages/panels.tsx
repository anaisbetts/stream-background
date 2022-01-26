import * as React from 'react';

import PageContainer from '../components/page-container';
import { useState } from 'react';
import RequireGoogleAuth from '../components/require-google-auth';

const PANEL_WIDTH = 320;
const PANEL_HEIGHT = 100;
const BIGPANEL_HEIGHT = 300;

const PanelContainer: React.FunctionComponent<{
  big?: boolean;
  showBorder?: boolean;
}> = ({ big, showBorder, children }) => (
  <>
    <style jsx>{`
      .outerFrame {
        width: ${PANEL_WIDTH}px;
        height: ${big ? BIGPANEL_HEIGHT : PANEL_HEIGHT}px;
        border: ${showBorder ? '1px dashed red' : 'none'};
        background: rgba(0, 0, 0, 0);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 8px;
      }

      .innerFrame {
        border-radius: 16px;
        padding: 8px 16px 8px 16px;

        display: flex;
        flex-direction: column;
      }
    `}</style>
    <div className="outerFrame">
      <div className="backgroundImage innerFrame">{children}</div>
    </div>
  </>
);

export default function Panels() {
  const [border, setBorder] = useState(false);

  return (
    <>
      <style jsx global>{`
        .container {
          padding: 64px;
          height: 100vh;
          font-size: 1.2em !important;
        }
      `}</style>

      <PageContainer>
        <div style={{ background: 'white', color: 'black' }}>
          <h2>Sections:</h2>
          {/*
        <ul>
          <li>About</li>
          <li>Rig (aka Amazon links)</li>
          <li>Social Media links</li>
          <li>Patreon maybe later</li>
        </ul>
        */}

          <p>
            <input
              type="checkbox"
              defaultChecked={border}
              onClick={() => setBorder(!border)}
            />
            Enable border rectangles
          </p>

          <PanelContainer showBorder={border}>
            <h2>I am a Panel</h2>
          </PanelContainer>

          <PanelContainer big showBorder={border}>
            <h2 style={{ alignSelf: 'center' }}>I am a Big Panel</h2>
            <p style={{ color: '#eee' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco.{' '}
            </p>
          </PanelContainer>
        </div>
      </PageContainer>
    </>
  );
}

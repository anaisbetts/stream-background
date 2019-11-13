import * as React from 'react';

import PageContainer from "../components/page-container";

export default () => (
  <>
    <style jsx global>{`
      .container {
        padding: 64px;
      }
    `}</style>

    <PageContainer>
      <h2>hi</h2>
      <p>hello world</p>
    </PageContainer>
  </>
)
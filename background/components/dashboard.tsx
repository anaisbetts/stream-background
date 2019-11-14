import * as React from 'react';

import PageContainer from "./page-container";
import { useQuery } from './when-firebase';
import { db } from './firebase';
import RequireGoogleAuth from './require-google-auth';

const TodoList: React.FunctionComponent = () => {
  const query = useQuery(() => db.collection('todos').orderBy('order', 'asc'));
  let todos = Array<JSX.Element>();

  if (query) {
    todos = query.docs.map(x => {
      const data: any = x.data();
      //const indent: number = data.indent || 0;

      return (<li key={x.id}>
        <input type="text"
          defaultValue={data.description}
          onChange={v => db.doc(x.ref.path)
            .set(Object.assign({}, data, { description: v.target.value }))} />
      </li>)
    });
  }

  return (<ul>{todos}</ul>);
};

export default () => {
  return (
    <>
      <style jsx global>{`
        ul {
          margin: 0;
          padding: 0;
          list-style-type: none
        }

        .container {
          padding: 128px;
        }
      `}</style>

      <RequireGoogleAuth>
        <PageContainer>
          <h2>TODO Editor</h2>
          <ul style={{ marginTop: 16 }}>
            <TodoList />
          </ul>
          <button style={{ marginTop: 16 }}>Add Item</button>
        </PageContainer>
      </RequireGoogleAuth>
    </>
  );
}
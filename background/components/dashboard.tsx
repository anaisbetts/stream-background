import * as React from 'react';

import { SortableContainer, SortableElement, SortEndHandler } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { QueryDocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types';

import PageContainer from "./page-container";
import { useQuery, useDocument } from './when-firebase';
import { db } from './firebase';
import RequireGoogleAuth from './require-google-auth';
import { useState } from 'react';

type OnDeleteCallback = ((q: QueryDocumentSnapshot) => void);

const _TodoItem: React.FunctionComponent<{ q: QueryDocumentSnapshot, onDelete: OnDeleteCallback }> = ({ q, onDelete }) => {
  const data = q.data();

  return <li key={q.id} style={{ paddingLeft: 3, background: 'green' }}>
    <input type="text"
      defaultValue={data.description}
      onChange={v => db.doc(q.ref.path)
        .update({ description: v.target.value })} />
    <button onClick={() => onDelete(q)}>X</button>
  </li>
};

const _TodoContainer: React.FunctionComponent<{ qs: QuerySnapshot, order: string[], onDelete: OnDeleteCallback }> = ({ qs, order, onDelete }) => {
  const lookup = qs.docs.reduce((acc, x) => {
    acc[x.id] = x;
    return acc;
  }, {});

  const docs = order.map(id => lookup[id]);
  const items = docs.map((x, i) => <TodoItem key={i} q={x} index={i} onDelete={onDelete} />);

  return <ul>{items}</ul>;
};

const TodoItem = SortableElement(_TodoItem);
const TodoContainer = SortableContainer(_TodoContainer);

const TodoList: React.FunctionComponent = () => {
  const query = useQuery(() => db.collection('todos'));

  const [updatedOrder, setUpdatedOrder] = useState(false);
  const metadata = useDocument(() => db.doc('metadata/todoOrdering'));

  if (!query) {
    return <ul />
  }

  if (metadata && !metadata.exists && !updatedOrder) {
    db.doc('metadata/todoOrdering').set({ order: query.docs.map(x => x.id) })
      .catch(ex => console.error(`Failed to set initial order! ${ex.message}`));

    setUpdatedOrder(true);
    return <ul />
  }

  if (!metadata) {
    return <ul />
  }

  const order: string[] = metadata!.data()!.order;

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    console.log(`old: ${oldIndex}, new: ${newIndex}`);
    const o = arrayMove(order, oldIndex, newIndex);

    console.log(JSON.stringify(o));
    metadata.ref.update({ order: o }).then(
      _ => console.log("Reordered!"),
      ex => `Failed to reorder! ${ex.message}`);
  };

  const onDelete: OnDeleteCallback = (q) => {
    metadata.ref.update({ order: order.filter(x => x != q.id) })
      .then(_ => q.ref.delete())
      .catch(ex => `Failed to delete item! ${ex.message}`);
  };

  return (<>
    <ul style={{ marginTop: 16 }}>
      <TodoContainer qs={query} order={order} onSortEnd={onSortEnd} onDelete={onDelete} />
    </ul>

    <button style={{ marginTop: 16 }} onClick={() => {
      db.collection('todos').add({ completedAt: null, description: "todo: write something here!", indent: 0 })
        .then(doc => metadata.ref.update({ order: order.concat([doc.id]) }))
        .catch(ex => `Failed to add new item! ${ex.message}`);
    }}>Add Item</button>
  </>);
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
          height: 100vw;
        }
      `}</style>

      <RequireGoogleAuth>
        <PageContainer>
          <h2>TODO Editor</h2>
          <TodoList />
        </PageContainer>
      </RequireGoogleAuth>
    </>
  );
}
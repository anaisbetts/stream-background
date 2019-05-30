import { Observable } from 'rxjs';
import { flatMap, publish, refCount, retry } from 'rxjs/operators';
import { firebaseBotPassword, firebaseBotUser, firebaseConfig } from './firebase-config';

import * as firebase from 'firebase';

import { ChatUserstate, Client, Options } from 'tmi.js';

interface MessageWithClient {
  client: Client;
  channel: string;
  userState: ChatUserstate;
  message: string;
}

function connectObservable(opts: Options) {
  const client = Client(opts);
  return new Observable((subj) => {
    client.once('connected', (_addr, _port) => {
      subj.next(client);
    });

    client.connect();
    return () => client.disconnect();
  });
}

function messageObservable(client: Client): Observable<MessageWithClient> {
  return new Observable(subj => {
    const handler = (channel: string, userState: ChatUserstate, message: string) => {
      subj.next({ client, channel, userState, message });
    };

    client.on('message', handler);
    return () => client.removeListener('message', handler);
  });
}

async function main() {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  await firebase.auth().signInWithEmailAndPassword(firebaseBotUser, firebaseBotPassword);

  const db = firebase.firestore();
  await db.collection('messages').add({
    foo: 'bar',
    baz: 'bamf',
  });

  const settings = {
    identity: {
      username: process.env.TWITCH_USER,
      password: process.env.TWITCH_OAUTH,
    },
    channels: [
      process.env.TWITCH_CHANNEL!,
    ],
  };

  console.log(`Connection info:\n${JSON.stringify(settings, null, 2)}`);
  const conn = connectObservable(settings).pipe(retry(), publish(), refCount());

  const listen = conn.pipe(
    flatMap(cli => messageObservable(cli)),
  );

  const writingListener = listen.pipe(flatMap(async x => {
    await db.collection('messages').add({
      channel: x.channel,
      user: x.userState,
      message: x.message,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
    });

    return x;
  }));

  writingListener.subscribe(
    x => console.log(`#${x.channel} ${x.userState.username}: ${x.message}`),
    ex => {
      console.error(ex.message);
      console.error(ex.stack);
      process.exit(-1);
    });
}

main().then(_ => console.log('Press Ctrl-C to exit'), e => {
  console.error(e.message);
  console.error(e.stack);
  process.exit(-1);
});

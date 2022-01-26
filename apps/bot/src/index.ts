import { Observable } from 'rxjs'
import { mergeMap, retry, share } from 'rxjs/operators'

import { db } from 'secrets/firebase'
import { ChatUserstate, Client, Options } from 'tmi.js'

import {
  defaultTwitchChannel,
  defaultTwitchUsername,
  firebaseBotPassword,
  firebaseBotUser,
} from 'secrets/firebase-config'

import { collection, Timestamp } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc } from 'firebase/firestore'

process.on('unhandledRejection', (e: Error) => {
  console.error(e)
  console.error(e.message)
  console.error(e.stack)
  process.exit(-1)
})

interface MessageWithClient {
  client: Client
  channel: string
  userState: ChatUserstate
  message: string
}

function connectObservable(opts: Options) {
  const client = Client(opts)
  return new Observable<Client>((subj) => {
    client.once('connected', (_addr, _port) => {
      subj.next(client)
    })

    client.connect()
    return () => client.disconnect()
  })
}

function messageObservable(client: Client): Observable<MessageWithClient> {
  return new Observable((subj) => {
    const handler = (
      channel: string,
      userState: ChatUserstate,
      message: string
    ) => {
      subj.next({ client, channel, userState, message })
    }

    client.on('message', handler)
    return () => client.removeListener('message', handler)
  })
}

async function main() {
  const auth = getAuth()
  await signInWithEmailAndPassword(auth, firebaseBotUser, firebaseBotPassword)

  await addDoc(collection(db, 'messages'), {
    foo: 'bar',
    baz: 'bamf',
  })

  if (!process.env.TWITCH_OAUTH) {
    throw new Error(
      'TWITCH_OAUTH environment variable not set! This will go poorly'
    )
  }

  const settings = {
    identity: {
      username: process.env.TWITCH_USER || defaultTwitchUsername,
      password: process.env.TWITCH_OAUTH,
    },
    channels: [process.env.TWITCH_CHANNEL || defaultTwitchChannel],
  }

  const conn = connectObservable(settings).pipe(retry(), share())

  const listen = conn.pipe(mergeMap((cli) => messageObservable(cli)))

  const writingListener = listen.pipe(
    mergeMap(async (x) => {
      if (x.userState['message-type'] !== 'chat') return x

      await addDoc(collection(db, 'messages'), {
        channel: x.channel,
        user: x.userState,
        message: x.message,
        timestamp: Timestamp.fromDate(new Date()),
      })

      return x
    })
  )

  writingListener.subscribe({
    next: (x) =>
      console.log(`#${x.channel} ${x.userState.username}: ${x.message}`),
    error: (ex) => {
      console.error(ex.message)
      console.error(ex.stack)
      process.exit(-1)
    },
  })
}

main().then(
  (_) => console.log('Press Ctrl-C to exit'),
  (e) => {
    console.error(e.message)
    console.error(e.stack)
    process.exit(-1)
  }
)

import { NowRequest, NowResponse } from '@now/node';

import { db } from './firebase';

export default async function (_req: NowRequest, res: NowResponse) {
  const msgs = await db.collection('messages').limit(5).get();
  console.log(msgs);

  res.status(200).send(JSON.stringify(msgs.docs.map(x => x.data().message)));
  res.end();
}

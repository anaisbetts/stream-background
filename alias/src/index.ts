import { NowRequest, NowResponse } from '@now/node';

import { db } from './firebase';

export default async function (req: NowRequest, res: NowResponse) {
  const q: string = req.query;

  const slug = q['slug'].split('/')[0] || 'me';

  const slugDoc = await db.collection('aliases').where('slug', '==', slug).limit(1).get();
  if (slugDoc.docs.length < 1) {
    res.status(404);
    res.send('dunno lol');
    return;
  }

  res.status(303);
  res.setHeader('Location', slugDoc.docs[0].data().target);
  res.end();
}

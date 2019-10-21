import { NowRequest, NowResponse } from '@now/node';

import LRU from 'lru-cache';
import { db } from './firebase';

const cache = new LRU<string, string>({ max: 2048, maxAge: 5 * 60 * 1000 });

export default async function (req: NowRequest, res: NowResponse) {
  const q = req.query['slug'];
  const qq = Array.isArray(q) ? q[0] : q;

  const slug = qq.split('/')[0] || 'me';
  let target;

  if (cache.has(slug)) {
    target = cache.get(slug);
  }

  if (!target) {
    const slugDoc = await db.collection('aliases').where('slug', '==', slug).limit(1).get();

    if (slugDoc.docs.length < 1) {
      res.status(404);
      res.send('dunno lol');
      return;
    }

    target = slugDoc.docs[0].data().target;
    cache.set(slug, target);
  }

  res.status(303);
  res.setHeader('Location', target);
  res.end();
}

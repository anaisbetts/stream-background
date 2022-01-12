import { NowRequest, NowResponse } from '@now/node';

import LRU from 'lru-cache';
import { db } from './firebase';

const cache = new LRU<string, string>({ max: 2048, maxAge: 5 * 60 * 1000 });

export default async function (req: NowRequest, res: NowResponse) {
  const q = req.query['slug'];
  let qq = Array.isArray(q) ? q[0] : q;

  let hostSlug;
  hostSlug = (req.headers['host'] || '')
    .replace('anais.dev', '')
    .replace(/:.*/i, '')
    .replace(/\.$/, '');

  if (hostSlug.length < 1) hostSlug = null;
  if ((!qq || qq.length < 1) && hostSlug) {
    qq = hostSlug;
  }

  const slug = qq.split('/')[0] || 'me';
  let target;

  if (slug === 'dump-keys') {
    const slugDocs = await db.collection('aliases').get();

    res.status(200);
    res.setHeader('Content-Type', 'text/plain');

    res.send('Here it is:\n\n' + slugDocs.docs.reduce((acc, x) => {
      acc += `${x.data().slug} => ${x.data().target}\n`;
      return acc;
    }, ''));
  }

  if (cache.has(slug)) {
    target = cache.get(slug);
  }

  if (!target) {
    const slugDoc = await db.collection('aliases').where('slug', '==', slug).limit(1).get();

    if (slugDoc.docs.length < 1) {
      res.status(404);
      // res.send(`dunno lol. host-based slug is ${nqq}, ${JSON.stringify(req.headers, null, 2)} `);
      res.send('dunno lol.');
      return;
    }

    target = slugDoc.docs[0].data().target;
    cache.set(slug, target);
  }

  res.status(303);
  res.setHeader('Location', target);
  res.end();
}

import { db } from '../src/firebase';

async function main() {
  const aliases = db.collection('aliases');
  const [slug, target] = process.argv.slice(2);

  console.log(`Setting /${slug} to '${target}'`);

  const existingAlias = await aliases.where('slug', '==', process.argv[2]).get();
  if (existingAlias.docs.length < 1) {
    await aliases.add({ slug, target });
  } else {
    await existingAlias.docs[0].ref.set({ slug, target });
  }
}

main().then(
  _ => process.exit(0),
  e => { console.error(e); process.exit(-1); },
);

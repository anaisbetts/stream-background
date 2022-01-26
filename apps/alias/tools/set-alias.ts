import { db } from '../src/firebase'
import { doc, setDoc } from 'firebase/firestore'

async function main() {
  const [slug, target] = process.argv.slice(2)

  console.log(`Setting /${slug} to '${target}'`)
  await setDoc(doc(db, 'aliases'), { slug, target })
}

main().then(
  (_) => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(-1)
  }
)

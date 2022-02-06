// A really big prime number
const p = 39916801

export function pickAtRandom<T>(arr: T[]) {
  const idx = Math.floor(Math.random() * p) % arr.length
  console.log(idx)
  return arr[idx]
}

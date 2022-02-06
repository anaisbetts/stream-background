import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { pickAtRandom } from '../components/util'

/* https://cssgradient.io/gradient-backgrounds/ */
const gradients = [
  (deg: number) => `linear-gradient(${deg}deg, #fccb90 0%, #d57eeb 100%)`,
  (deg: number) => `linear-gradient(${deg}deg, #8EC5FC 0%, #E0C3FC 100%)`,
  (deg: number) => `linear-gradient(${deg}deg, #FBDA61 0%, #FF5ACD 100%)`,
]

export default function GradientBackground() {
  const [deg, setDeg] = useState(0)
  const gradient = useRef<(n: number) => string>()
  const router = useRouter()

  useEffect(() => {
    console.log(router)
    console.log(router.query)
    if (router.query.gradient) {
      gradient.current = gradients[Number(router.query.gradient)]
    } else {
      gradient.current = pickAtRandom(gradients)
    }
  }, [router, router.query.gradient])

  useEffect(() => {
    const h = setTimeout(() => {
      setDeg(deg + 5)
    }, 50)

    return () => clearInterval(h)
  }, [deg])

  const g = gradient.current ? gradient.current(deg % 360) : ''
  return (
    <div className="w-screen h-screen">
      <div
        className="w-full h-full rounded-2xl absolute"
        style={{ backgroundImage: g }}
      ></div>
    </div>
  )
}

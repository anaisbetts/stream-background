export default function GradientBackground() {
  return (
    <div
      style={{
        width: '400vw',
        height: '400vh',
        left: '-150vw',
        top: '-150vw',
        position: 'absolute',
        animation: 'spin 5s ease-in -out infinite',
      }}
      className="gradient"
    >
      hi
    </div>
  )
}

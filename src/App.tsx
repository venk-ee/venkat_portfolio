import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import InfoPanel from './components/sections/Hero/InfoPanel'
import BadgeScene from './components/3d/Badge/scene'

function App() {
  return (
    <main id="top" className="min-h-screen bg-bg text-cream">
      <Header />

      {/* Hero: badge canvas underneath, text on top. The pointer-events split
          is what lets the badge be dragged from the empty space. */}
      <div className="relative min-h-screen w-full overflow-hidden bg-bg">
        <div className="absolute inset-0">
          <BadgeScene />
        </div>
        <section className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-8 md:px-16">
          <div className="pointer-events-auto w-full max-w-lg py-24">
            <InfoPanel />
          </div>
          <div className="hidden flex-1 md:block" />
        </section>
      </div>

      <Footer />
    </main>
  )
}

export default App

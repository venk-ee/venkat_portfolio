    import InfoPanel from './components/sections/Hero/InfoPanel'
    import BadgeScene from './components/3d/Badge/scene'

    function App() {
      return (
        <main className="min-h-screen bg-bg text-cream">
          {/* Hero — warm black */}
          <div className="flex flex-col md:flex-row min-h-screen w-full bg-bg">
            <section className="flex-none w-full md:w-[40%] flex items-center justify-center p-8 md:p-16">
              <InfoPanel />
            </section>
            <section className="flex-1 min-h-[450px] md:h-screen relative">
              <BadgeScene /> 
            </section>
          </div>

          {/* Soft footer fade — cream to mint to lime */}
          <section className="tl-fade relative z-10 -mt-10 rounded-t-[2.5rem]">
            <div className="mx-auto flex min-h-[45vh] max-w-6xl flex-col items-center justify-end px-8 pb-10 pt-32 text-center">
              <p className="font-mono text-sm text-ink/60">© 2026 Venkat. All rights reserved.</p>
            </div>
          </section>
        </main>
      )
    }

    export default App

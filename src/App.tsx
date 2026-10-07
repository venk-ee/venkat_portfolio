    import InfoPanel from './components/sections/Hero/InfoPanel'
    import BadgeScene from './components/3d/Badge/scene'

    function App() {
      return (
        <main className="min-h-screen bg-bg text-white">
          <div className="flex flex-col md:flex-row min-h-screen w-full">
            <section className="flex-none w-full md:w-[40%] flex items-center justify-center p-8 md:p-16 bg-bg">
              <InfoPanel />
            </section>
            <section className="flex-1 min-h-[450px] md:h-screen  bg-bg relative">
              <BadgeScene /> 
            </section>
          </div>
        </main>
      )
    }

    export default App

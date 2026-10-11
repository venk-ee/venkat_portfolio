

export default function InfoPanel(){
    return(
        <div className="flex flex-col justify-center h-full max-w-lg space-y-6 text-left">
            <div className="w-12 h-1 bg-accent rounded"></div>
            <div>
                <h1 className="text-5xl font-black tracking-tight text-cream md:text-6xl font-sans">Venkat</h1>
                <p className="text-lg text-cream/70 mt-2">Software Engineer</p>
            </div>
            <p className="text-cream/60 leading-relaxed text-base font-sans">
                Building intelligent machines that see, think, and interact with the physical world.
                Specializing in computer vision, robotic perception, and real-time 3D systems.
            </p>

            <div className="flex flex-wrap gap-3 pt-4 font-mono text-sm"> 
                <a href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full bg-accent text-ink hover:bg-accent-hover transition-colors duration-300">
                    GitHub
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2 rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-ink transition-colors duration-300">
                    LinkedIn
                </a>

                <a href="mailto:venkat@example.com" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2 rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-ink transition-colors duration-300">
                    Email
                </a>
            </div>

            {/* Interaction Hint (Responsive states) */}
          {/* <div className="pt-8 text-xs font-mono text-text-muted/60 animate-pulse hidden md:block">
            &lt; Drag the ID card on the right to interact &gt;
          </div>
          <div className="pt-8 text-xs font-mono text-text-muted/60 animate-pulse block md:hidden">
            &lt; Scroll down to interact with the ID card &gt;
          </div> */}
        </div>
    )
}
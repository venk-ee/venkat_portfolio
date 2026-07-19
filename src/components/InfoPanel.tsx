

export default function InfoPanel(){
    return(
        <div className="flex flex-col justify-center h-full max-w-lg space-y-6 text-left">
            <div className="w-12 h-1 bg-accent rounded"></div>
            <div>
                <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl font-sans">Venkat</h1>
                <p className="text-lg text-gray-400 mt-2">Software Engineer</p>
            </div>
            <p className="text-text-muted leading-relaxed text-base font-sans">
                Building intelligent machines that see, think, and interact with the physical world.
                Specializing in computer vision, robotic perception, and real-time 3D systems.
            </p>

            <div className="flex flex-wrap gap-6 pt-4 font-mono text-sm"> 
                <a href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover transition-colors duration-300 underline underline-offset-4">
                    GitHub
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover transition-colors duration-300 underline underline-offset-4">
                    LinkedIn
                </a>

                <a href="mailto:venkat@example.com" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover transition-colors duration-300 underline underline-offset-4">
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
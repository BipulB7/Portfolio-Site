import { ArrowDown } from "lucide-react";
import bips from "../assets/bips.jpg"; // adjust path if needed

export const HeroSection = () => {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-4"
    >
      <div className="container mx-auto max-w-6xl z-10">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-20">
          {/* === IMAGE LEFT === */}
          <div className="w-full md:w-1/2 flex justify-center opacity-0 animate-fade-in">
            <img
              src={bips}
              alt="Bipul Banjade"
              className="rounded-xl object-cover shadow-lg w-full max-w-sm h-auto"
            />
          </div>

          {/* === TEXT RIGHT === */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="opacity-0 animate-fade-in"> Hi, I'm</span>
              <span className="text-primary opacity-0 animate-fade-in-delay-1">
                {" "}
                Bipul
              </span>
              <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-2">
                {" "}
                Banjade
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl opacity-0 animate-fade-in-delay-3">
              Aspiring Software Engineer with extensive experience working on optimizing industry-leading LLMs for efficiency, accuracy, and scientific reasoning.
              <br />
              <br />
              I specialize in building intricate web applications using React, TypeScript, Tailwind CSS, Vite, and Framer Motion (as used here), advanced Python physics simulations, and AI integrations for apps.
            </p>

            <div className="pt-4 opacity-0 animate-fade-in-delay-4">
              <button onClick={scrollToAbout} className="cosmic-button">
                View My Work
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Button */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer"
        onClick={scrollToAbout}
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll</span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};

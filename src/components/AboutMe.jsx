import { useEffect, useRef, useState } from "react";
import { Code, Atom } from "lucide-react";
import nyulogo from "../assets/nyulogo.png";
import fanaticsLogo from "../assets/fanatics.png"; // Added Fanatics logo
import scaleLogo from "../assets/scale.jpeg";
import libLogo from "../assets/library.png";

export const AboutMe = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Adjusted threshold for better trigger timing
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  const scrollToSkills = () => {
    const nextSection = document.querySelector("#skills");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeInClass = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  const transitionClass = "transition-all duration-700 ease-out";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 px-4 relative min-h-screen"
    >
      <div className="container mx-auto max-w-5xl">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-16 text-center ${fadeInClass} ${transitionClass}`}
        >
          My <span className="text-primary">Experience</span>
        </h2>

        <div className="space-y-12">
          {/* === EDUCATION === */}
          <div className={`flex flex-col md:flex-row gap-4 md:gap-8 ${fadeInClass} ${transitionClass} delay-100`}>
            <div className="flex items-center gap-4 min-w-[280px]">
              <img
                src={nyulogo}
                alt="NYU Logo"
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-xl md:text-2xl font-semibold">
                New York University
              </h3>
            </div>
            <p className="text-muted-foreground md:border-l-2 md:border-border md:pl-8">
              I'm pursuing a dual major in Computer Science and Physics, where I blend rigorous computational theory with first-principles scientific thinking. This unique combination allows me to approach complex software and AI problems with a deep, analytical perspective.
            </p>
          </div>

          {/* === FANATICS EXPERIENCE === */}
          <div className={`flex flex-col md:flex-row gap-4 md:gap-8 ${fadeInClass} ${transitionClass} delay-200`}>
            <div className="flex items-center gap-4 min-w-[280px]">
              <img
                src={fanaticsLogo}
                alt="Fanatics Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <h3 className="text-xl md:text-2xl font-semibold">Fanatics</h3>
            </div>
            <p className="text-muted-foreground md:border-l-2 md:border-border md:pl-8">
              At Fanatics, I focused on applying AI to solve tangible business problems. My work involved building an end-to-end intelligent system to automate corporate invoice analysis, which helped streamline a critical and time-consuming workflow for the finance and M&A teams.
            </p>
          </div>

          {/* === SCALE AI EXPERIENCE === */}
          <div className={`flex flex-col md:flex-row gap-4 md:gap-8 ${fadeInClass} ${transitionClass} delay-300`}>
            <div className="flex items-center gap-4 min-w-[280px]">
              <img
                src={scaleLogo}
                alt="Scale AI Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <h3 className="text-xl md:text-2xl font-semibold">Scale AI</h3>
            </div>
            <p className="text-muted-foreground md:border-l-2 md:border-border md:pl-8">
              My work at Scale AI placed me at the core of the GenAI ecosystem. My responsibilities spanned from creating high-quality training data for Tier-1 LLMs to performing deep systems work to improve the performance and reliability of large-scale AI training pipelines.
            </p>
          </div>

          {/* === KEY PROJECTS === */}
          <div className={`flex flex-col md:flex-row gap-4 md:gap-8 ${fadeInClass} ${transitionClass} delay-400`}>
            <div className="flex items-center gap-4 min-w-[280px]">
               <div className="p-2 rounded-full bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold">Key Projects</h3>
            </div>
             <p className="text-muted-foreground md:border-l-2 md:border-border md:pl-8">
              My personal projects demonstrate a passion for building complete, end-to-end solutions. These range from exploring deep learning theory by building models from scratch in PyTorch to developing full-stack, AI-powered applications like a RAG-based research hub.
            </p>
          </div>

        </div>

        {/* Call to Action */}
        <div className={`flex flex-col sm:flex-row gap-4 pt-16 justify-center ${fadeInClass} ${transitionClass} delay-500`}>
          <a href="#contact" className="cosmic-button">
            Get In Touch
          </a>
          <a
            href="/resume.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
};
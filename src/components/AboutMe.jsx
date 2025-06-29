import { useEffect, useRef, useState } from "react";
import { Code, Atom, ArrowDown } from "lucide-react";
import nyulogo from "../assets/nyulogo.png";
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
      { threshold: 0.3 }
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
          className={`text-3xl md:text-4xl font-bold mb-12 text-center ${fadeInClass} ${transitionClass}`}
        >
          About <span className="text-primary">Me</span>
        </h2>

        <div className="space-y-12">
          {/* === EDUCATION === */}
          <div className={`flex flex-col gap-2 ${fadeInClass} ${transitionClass} delay-100`}>
            <div className="flex items-center gap-4">
              <img
                src={nyulogo}
                alt="NYU Logo"
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-xl md:text-2xl font-semibold">
                New York University
              </h3>
            </div>
            <p className="text-muted-foreground pl-14">
              Pursuing a dual major in Computer Science and Physics at NYU with
              concentrations in systems engineering and experimental physics.
              Gaining deep experience in computational thinking, scientific
              modeling, and software development.
            </p>
          </div>

          {/* === WORK EXPERIENCE === */}
          <div className={`flex flex-col gap-2 ${fadeInClass} ${transitionClass} delay-200`}>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <img
                  src={scaleLogo}
                  alt="Scale AI Logo"
                  className="h-6 w-6 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold">Scale AI</h3>
            </div>
            <p className="text-muted-foreground pl-14">
              Working on optimizing LLMs by curating high-quality
              human-in-the-loop training data for reasoning, STEM accuracy, and
              instruction following. Contributed to real-world AI product
              pipelines used in production models.
            </p>
          </div>

          {/* === LIBRARY WORK === */}
          <div className={`flex flex-col gap-2 ${fadeInClass} ${transitionClass} delay-300`}>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <img
                  src={libLogo}
                  alt="Library Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold">
                NYU Elmer Holmes Bobst Library
              </h3>
            </div>
            <p className="text-muted-foreground pl-14">
              Supported NYU students and faculty by managing scientific and computing materials, assisting with research access, and helping maintain lab equipment and resources. Collaborated on organizing academic materials and facilitating knowledge-sharing environments.
            </p>
          </div>

          {/* === SCIENTIFIC WORK === */}
          <div className={`flex flex-col gap-2 ${fadeInClass} ${transitionClass} delay-400`}>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Atom className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Physics + AI Research
              </h3>
            </div>
            <p className="text-muted-foreground pl-14">
              Developed scientific simulations using Python, NumPy, and
              Matplotlib to model physical systems. Blending machine learning
              with scientific methods to explore intelligent computation
              grounded in physical theory.
            </p>
          </div>

          {/* === TECHNICAL PROJECTS === */}
          <div className={`flex flex-col gap-2 ${fadeInClass} ${transitionClass} delay-500`}>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Web Development Projects
              </h3>
            </div>
            <p className="text-muted-foreground pl-14">
              Built full-stack and front-end applications using React,
              TypeScript, Tailwind, Vite, and Framer Motion. Designed sleek UI
              components and deployed portfolio and project sites on Netlify
              and GitHub Pages.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`flex flex-col sm:flex-row gap-4 pt-12 justify-center ${fadeInClass} ${transitionClass} delay-600`}>
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

      {/* Scroll Button */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer"
        onClick={scrollToSkills}
      >
        <span className="text-sm text-muted-foreground mb-2"> Scroll </span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};

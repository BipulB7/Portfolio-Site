import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import cosmicoImage from "../assets/cosmico.png";
import physicsImage from "../assets/phys.png";
import portfolioImage from "../assets/porto.png";

const projects = [
  {
    id: 1,
    title: "Cosmico AI Research Hub",
    description:
      "A collaborative AI platform built for scientific discovery using ArXiV, openAI, JS(React,Node), and a cross-api communication architecture.",
    image: cosmicoImage,
    tags: ["React", "Node.js", "LLMs", "MongoDB"],
    demoUrl: "https://cosmicoai.netlify.app",
    githubUrl: "https://github.com/BipulB7/Cosmico-Backend",
  },
  {
    id: 2,
    title: "Advanced Physics Simulations",
    description:
      "A Python-driven suite of 8+ simulations modeling quantum phenomena, classical dynamics, and experimental statistical behavior using scientific libraries.",
    image: physicsImage,
    tags: ["Python", "NumPy", "Matplotlib", "SciPy"],
    demoUrl: "https://github.com/BipulB7",
    githubUrl: "https://github.com/BipulB7",
  },
  {
    id: 3,
    title: "Portfolio Website",
    description:
      "This sleek personal website was built using React, Tailwind CSS, Vite, EmailJS, and custom animations. It features dark mode persistence, smooth scroll-based fades, responsive sections, and modular architecture for future expansion.",
    image: portfolioImage,
    tags: ["React", "Tailwind", "Vite", "EmailJS"],
    demoUrl: "https://bipulpbanjade.com/",
    githubUrl: "https://github.com/BipulB7/Portfolio-Site",
  },
];

export const ProjectsSection = () => {
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

  const scrollToNext = () => {
    const nextSection = document.querySelector("#contact");
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
      id="projects"
      ref={sectionRef}
      className="py-24 px-4 relative min-h-screen"
    >
      <div className="container mx-auto max-w-5xl">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-4 text-center ${fadeInClass} ${transitionClass}`}
        >
          Featured <span className="text-primary">Projects</span>
        </h2>

        <p
          className={`text-center text-muted-foreground mb-12 max-w-2xl mx-auto ${fadeInClass} ${transitionClass}`}
        >
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch ${fadeInClass} ${transitionClass}`}
        >
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 mt-auto">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition"
                  >
                    WEBSITE
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline text-center"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 ${fadeInClass} ${transitionClass}`}>
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/BipulB7"
          >
            Check Out My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer"
        onClick={scrollToNext}
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll</span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};

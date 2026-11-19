import { useEffect } from "react";
import { StarBackground } from "../components/StarBackground";
import { Intro } from "../components/Intro";
import { ScrollProgress } from "../components/ScrollProgress";
import { NavBar } from "../components/NavBar";
import { HeroSection } from "../components/HeroSection";
import { AboutMe } from "../components/AboutMe";
import { ProjectsSection } from "../components/ProjectsSection";
import { SkillsSection } from "../components/SkillsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export const Home = () => {
  useEffect(() => {
    // Always start at the top on first load (main.jsx disables scroll restoration)
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <Intro />

      {/* Fixed background layers: starfield, aurora, film grain, scanlines */}
      <StarBackground />

      <ScrollProgress />
      <NavBar />

      <main className="relative z-10">
        <HeroSection />
        <AboutMe />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

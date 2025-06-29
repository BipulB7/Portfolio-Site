import { ThemeToggle } from "../components/ThemeToggle";
import { StarBackground } from "../components/StarBackground";
import { NavBar } from "../components/NavBar";
import { HeroSection } from "../components/HeroSection";
import { AboutMe } from "../components/AboutMe";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ContactSection } from "../components/ContactSection";

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

        { /* Theme Toggle */}
        <ThemeToggle/>

        { /* BgroundEffects Toggle */}
        <StarBackground/>

        { /* NavBar Toggle */}
        <NavBar />

        { /* Content Toggle */}
        <main>
            <HeroSection />
            <AboutMe />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
        </main>


        { /* Footer Toggle */}


    </div>
    );
};
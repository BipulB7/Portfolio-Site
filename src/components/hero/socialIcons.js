import { Github, Instagram, Linkedin, Link as LinkIcon } from "lucide-react";

/** Maps `socials[].icon` keys from content.js to lucide icons. */
const icons = { github: Github, linkedin: Linkedin, instagram: Instagram };

export const getSocialIcon = (key) => icons[key] ?? LinkIcon;

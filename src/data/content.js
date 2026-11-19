/**
 * All site copy lives here so content can be updated without touching layout.
 *
 * AKASH SYSTEMS RULES (public site):
 * - High-level descriptions only. No internal names, hostnames, IPs, serials,
 *   customer/coworker names, internal links or screenshots of internal tools.
 * - GPUs are described generically ("8-GPU AI servers").
 * - The results below are rounded, wide-audience figures. Set
 *   SHOW_AKASH_RESULTS to false to hide every number in one place.
 */

import nyuLogo from "../assets/nyulogo.png";
import fanaticsLogo from "../assets/fanatics.png";
import scaleLogo from "../assets/scale.jpeg";
import libraryLogo from "../assets/library.png";
import cosmicoImage from "../assets/cosmico.png";

export const SHOW_AKASH_RESULTS = true;

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */
export const profile = {
  firstName: "Bipul",
  lastName: "Banjade",
  role: "AI & Systems Engineer",
  location: "New York / Maryland, USA",
  email: "bpb9329@nyu.edu",
  phone: "+1 (443) 729-6621",
  phoneHref: "tel:+14437296621",
  resume: "/resume.pdf",
  current: {
    company: "Akash Systems",
    // Job title not confirmed yet; leave null until it is.
    title: null,
    type: "Full-time",
    focus: "Diamond cooling for AI servers",
  },
  // Words cycled in the hero: "I build ___"
  rotatingWords: [
    "GPU test platforms",
    "thermal experiments",
    "AI-powered tools",
    "precision lab hardware",
    "full-stack systems",
  ],
  intro:
    "I work where AI meets hardware. At Akash Systems I build the software, experiments and test hardware behind diamond cooling for AI GPU servers.",
  introSecondary:
    "Before that I built AI tools at Fanatics and Scale AI, and studied Computer Science and Physics at NYU.",
  // Decorative "now playing" widget in the hero
  nowBuilding: {
    label: "Now building",
    track: "Diamond-cooled AI servers",
    artist: "Akash Systems",
  },
  heroStats: [
    { value: "170+", label: "platform releases shipped" },
    { value: "4", label: "domains: software · thermal · CAD · infra" },
    { value: "NYU ’26", label: "CS + Physics" },
  ],
  about: [
    "I like problems that span layers: a web app that drives real hardware, an experiment whose result has to survive an independent check, a 3D-printed part that has to fit the first time.",
    "My background is a double major in Computer Science and Physics, which means I reach for first principles and measurements before opinions. Today that shows up as test platforms, verified analysis pipelines and mechanical prototypes for next-generation GPU cooling.",
  ],
};

export const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bipul77/", icon: "linkedin" },
  { name: "GitHub", href: "https://github.com/BipulB7", icon: "github" },
  { name: "Instagram", href: "https://www.instagram.com/bipssb/?hl=en", icon: "instagram" },
];

/* Section ids, nav labels and retro "track" numbers used in section eyebrows
   (e.g. "Track 01 · About"), like a cassette track list. */
export const navItems = [
  { id: "hero", label: "Home", track: "00" },
  { id: "about", label: "About", track: "01" },
  { id: "projects", label: "Work", track: "02" },
  { id: "skills", label: "Skills", track: "03" },
  { id: "contact", label: "Contact", track: "04" },
];

/* ------------------------------------------------------------------ */
/* Experience (newest first)                                           */
/* ------------------------------------------------------------------ */
export const experience = [
  {
    id: "akash",
    company: "Akash Systems",
    logo: null, // no logo asset: render a generic diamond mark, not their brand
    title: null, // TODO: add job title once confirmed
    type: "Full-time",
    period: "Jun 2026 – Present",
    location: null,
    featured: true,
    summary:
      "Working across software, hardware test and mechanical design for diamond heat-spreader technology on AI GPU servers.",
    highlights: [
      "Built and run the lab's full-stack test platform (FastAPI, React, PostgreSQL): GPU stress-test orchestration, power and fan control, hardware inventory and telemetry export. 170+ releases in about four months.",
      "Designed and ran same-card before/after thermal validation campaigns on air- and liquid-cooled 8-GPU AI servers, with drift correction and independently verified analysis.",
      "Turn results into scripted executive decks and interactive data visualizations.",
      "Design and 3D-print assembly jigs and liquid-cooling test hardware in Python CAD, and run lab infrastructure from server bring-up to monitoring and hardware fault diagnosis.",
    ],
    tags: ["Python", "FastAPI", "React", "PostgreSQL", "GPU thermal testing", "CadQuery", "3D printing"],
  },
  {
    id: "fanatics",
    company: "Fanatics",
    logo: fanaticsLogo,
    title: "AI Software Engineer Intern",
    type: "Internship",
    period: "Aug 2025 – Jul 2026",
    location: "New York, NY",
    summary: "Applied AI to finance and M&A workflows.",
    highlights: [
      "Built a full-stack AI invoice analyzer (FastAPI, Docker, Redis, AWS Textract, GPT-4, pgvector) that saved 70+ hours a week across 20+ employees.",
      "Raised M&A and finance team productivity by 40–60% with agentic AI workflows for data parsing, schema mapping, policy checks and risk analysis.",
    ],
    tags: ["FastAPI", "Docker", "Redis", "AWS Textract", "LLMs", "pgvector"],
  },
  {
    id: "scale",
    company: "Scale AI",
    logo: scaleLogo,
    title: "Generative AI Engineer",
    type: "Contract",
    period: "Apr 2024 – Jul 2025",
    location: "Remote",
    summary: "Worked at the core of the GenAI training-data and pipeline ecosystem.",
    highlights: [
      "Optimized FastAPI services and PostgreSQL for an LLM training pipeline, cutting downtime by 60% and raising task throughput by 30%.",
      "Tuned agentic ML systems (time-series, regression) to turn raw sales data into schema-aligned outputs for demand forecasting.",
      "Wrote 250+ programs in Python, JavaScript and C++ to generate high-quality training data for Tier-1 LLMs.",
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "LLM training data", "ML"],
  },
  {
    id: "nyu-it",
    company: "NYU Bobst Library",
    logo: libraryLogo,
    title: "IT Research Technician",
    type: "Part-time",
    period: "Sep 2023 – Dec 2024",
    location: "New York, NY",
    summary: "Kept research access running for library patrons.",
    highlights: [
      "Resolved technical issues for 300+ library patrons a day.",
      "Wrote and deployed macOS scripts for access control, saving 5+ hours of manual work a week.",
    ],
    tags: ["macOS scripting", "IT support"],
  },
];

export const education = {
  school: "New York University",
  logo: nyuLogo,
  degree: "Bachelor's in Computer Science, double major in Physics",
  period: "Aug 2022 – May 2026",
  coursework: [
    "Artificial Intelligence",
    "Operating Systems",
    "Data Structures & Algorithms",
    "Computer Vision",
    "Quantum Mechanics",
  ],
};

/* ------------------------------------------------------------------ */
/* Selected results (rounded, high level). Hidden if SHOW_AKASH_RESULTS */
/* is false.                                                            */
/* ------------------------------------------------------------------ */
export const akashResults = [
  { value: "~26 °C", label: "cooler hotspot on an air-cooled GPU" },
  { value: "~½", label: "die-level thermal resistance" },
  { value: "8 → 0", label: "throttling events in die-level tests" },
  { value: "30%", label: "lower fan speed at the same GPU temperature" },
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* art = which generative cover to draw (see ProjectArt)              */
/* ------------------------------------------------------------------ */
export const projects = [
  {
    id: "lab-platform",
    org: "Akash Systems",
    kind: "work",
    year: "2026",
    art: "lattice",
    title: "GPU Lab Test Platform",
    tagline: "The full-stack web app a GPU hardware lab runs on.",
    summary:
      "I am the main developer of the internal platform engineers use every day to launch and monitor GPU tests, control lab hardware, track parts and export data.",
    points: [
      "Orchestrates stress tests, power-cap ramps, thermal test matrices and long-duration validation runs on remote GPU servers, with live console output and recovery after restarts.",
      "Controls server fans, host power and rack power outlets, with ownership locks and an audit trail on every power action.",
      "Tracks every GPU and server: barcode intake, automatic hardware capture, per-slot history and failure-analysis records.",
      "Exports per-run telemetry for analysis, sends thermal alerts, and uses single sign-on with role-based access.",
    ],
    stats: [
      { value: "170+", label: "releases" },
      { value: "~4 mo", label: "to build" },
      { value: "Daily", label: "use on real hardware" },
    ],
    tags: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "React", "TypeScript", "Docker"],
    links: [],
  },
  {
    id: "diamond-validation",
    org: "Akash Systems",
    kind: "work",
    year: "2026",
    art: "thermal",
    title: "Measuring Diamond Cooling",
    tagline: "Unbiased before/after thermal tests on 8-GPU AI servers.",
    summary:
      "Designed and ran the thermal campaigns that measure how much a diamond heat spreader improves GPU cooling, on air-cooled and direct-liquid-cooled servers.",
    points: [
      "Same-card method: measure a stock GPU, convert it, then re-run identical tests on the same card in the same slot.",
      "Corrected for drift using the untouched GPUs in the same server as a control group.",
      "Every reported number comes from scripted pipelines over raw logs and is recomputed by an independent verification script.",
      "Caveats that cut against the result are stated openly.",
    ],
    showResults: true,
    tags: ["Python", "pandas", "NumPy", "Thermal analysis", "Air & liquid cooling"],
    links: [],
  },
  {
    id: "thermal-replays",
    org: "Akash Systems",
    kind: "work",
    year: "2026",
    art: "replay",
    title: "Interactive Thermal Replays",
    tagline: "Animated replays that make test data easy to read.",
    summary:
      "Built interactive web pages and scripted decks that turn GPU test data into something leadership can read at a glance.",
    points: [
      "Animated die-map replays of real test data, with play, scrub and speed controls and export to video.",
      "Before/after comparisons and a plain-language guide to reading the numbers.",
      "Decks generated from scripts, so a data change rebuilds every chart.",
    ],
    tags: ["Canvas / SVG", "JavaScript", "matplotlib", "Data storytelling"],
    links: [],
  },
  {
    id: "mech-hardware",
    org: "Akash Systems",
    kind: "work",
    year: "2026",
    art: "cad",
    title: "Precision Assembly & Cooling Hardware",
    tagline: "Python-CAD jigs and liquid-cooling test fixtures, iterated on the bench.",
    summary:
      "Designed and 3D-printed the tooling used to assemble segmented diamond spreaders, plus liquid-cooling test hardware.",
    points: [
      "Assembly jig through four printed versions, each driven by operator feedback: flexure levers, a click-latch that opens all levers at once, and a shim-placement guide.",
      "CAD written in Python (CadQuery) with automated interference checks.",
      "Liquid-cooling test housing iterated through several versions and pressure tested, with design changes that greatly reduced the force needed to seat parts.",
      "Scripted, tuned 3D-printing workflow for watertight parts and small features.",
    ],
    tags: ["CadQuery", "Python", "3D printing", "Flexure design", "Fluid sealing"],
    links: [],
  },
  {
    id: "lab-infra",
    org: "Akash Systems",
    kind: "work",
    year: "2026",
    art: "network",
    title: "Lab Infrastructure & Diagnostics",
    tagline: "Networking, power automation, monitoring and fault-finding for a GPU lab.",
    summary:
      "Run the infrastructure a GPU server lab depends on, and trace hardware failures to their source.",
    points: [
      "Server bring-up for 8-GPU AI servers, with a step-by-step runbook.",
      "Network design for a new server room, with zone-based firewall rules and VPN access.",
      "Automated rack power control, monitoring dashboards and alerting.",
      "Diagnosed GPU and server faults from driver, BMC and baseboard logs, and separated chassis faults from GPU faults.",
    ],
    tags: ["Linux", "Networking", "Prometheus", "Grafana", "Home Assistant", "Redfish / IPMI"],
    links: [],
  },
  {
    id: "cosmico",
    org: "Personal",
    kind: "personal",
    year: "2025",
    art: "constellation",
    image: cosmicoImage,
    title: "Cosmico AI Research Hub",
    tagline: "A RAG-powered research assistant for scientific papers.",
    summary:
      "An end-to-end full-stack research site that pulls papers from arXiv in real time and uses LLMs for citations and summaries.",
    points: [
      "React, Tailwind, Node.js, Express and MongoDB, with cross-API orchestration between OpenAI and arXiv.",
      "Cost-aware model routing sends small tasks to smaller models: about 60% lower API cost and ~40% lower latency.",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "RAG", "OpenAI"],
    links: [
      { label: "Live site", href: "https://cosmicoai.netlify.app", kind: "demo" },
      { label: "GitHub", href: "https://github.com/BipulB7/Cosmico-Backend", kind: "github" },
    ],
  },
  {
    id: "erc20",
    org: "Personal",
    kind: "personal",
    year: "2025",
    art: "ledger",
    title: "ERC-20 Wallet Balance Service",
    tagline: "Point-in-time token balances, computed correctly.",
    summary:
      "A backend service that computes ERC-20 wallet balances at any timestamp from token transfers and price data.",
    points: [
      "FastAPI and PostgreSQL with indexed caching, idempotent backfills, chain-reorg handling and LRU price lookups.",
      "Fully containerized (API, database, Redis) with Docker Compose.",
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    links: [{ label: "GitHub", href: "https://github.com/BipulB7/ERC-20-Wallet-Service", kind: "github" }],
  },
  {
    id: "cnn",
    org: "Personal",
    kind: "personal",
    year: "2025",
    art: "neural",
    title: "CNN from Scratch",
    tagline: "Convolutional networks with hand-written backprop.",
    summary:
      "A convolutional neural network built from scratch in PyTorch, plus transfer learning on a harder dataset.",
    points: [
      "Implemented forward and backward passes by hand for Conv2D, MaxPool2D and Linear layers: 96.44% test accuracy on MNIST.",
      "Fine-tuned a pre-trained ResNet-18 for 62-class EMNIST with phased training (linear probing, then partial unfreezing).",
    ],
    tags: ["PyTorch", "Computer vision", "Deep learning"],
    links: [{ label: "GitHub", href: "https://github.com/BipulB7/CNN-Pytorch-Project", kind: "github" }],
  },
];

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* icon = lucide-react icon name                                       */
/* ------------------------------------------------------------------ */
export const skillGroups = [
  {
    id: "ai",
    label: "AI & Machine Learning",
    icon: "BrainCircuit",
    items: ["PyTorch", "TensorFlow", "scikit-learn", "RAG", "LLM integration", "LangChain", "Transformers", "Vector databases"],
  },
  {
    id: "backend",
    label: "Backend & Systems",
    icon: "Server",
    items: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Node.js", "Express", "Redis", "Docker", "REST APIs", "C / C++", "Java", "SQL"],
  },
  {
    id: "frontend",
    label: "Frontend",
    icon: "LayoutTemplate",
    items: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "three.js", "Canvas / SVG animation"],
  },
  {
    id: "data",
    label: "Data & Telemetry",
    icon: "LineChart",
    items: ["pandas", "NumPy", "Matplotlib", "Prometheus / PromQL", "VictoriaMetrics", "Grafana", "Verification pipelines", "Excel automation"],
  },
  {
    id: "hardware",
    label: "Hardware & Thermal",
    icon: "Thermometer",
    items: ["GPU thermal testing", "Thermal resistance analysis", "Air & liquid cooling", "ROCm toolchain", "BMC Redfish & IPMI", "Fan-curve tuning", "RAS / ECC log analysis"],
  },
  {
    id: "mechanical",
    label: "Mechanical & CAD",
    icon: "Box",
    items: ["CadQuery (Python CAD)", "Flexure & latch design", "Fluid sealing & pressure design", "3D printing (PETG)", "Slicer automation", "Tolerancing from measured parts"],
  },
  {
    id: "infra",
    label: "Infrastructure",
    icon: "Network",
    items: ["Linux & systemd", "Networking (VLANs, firewalls, VPN)", "Home Assistant & SNMP", "Rack power automation", "iPXE netboot", "SSO & role-based access", "Git & versioned releases"],
  },
];

// Big scrolling strip in the Skills section
export const marqueeSkills = [
  "Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "PyTorch", "Docker",
  "Thermal testing", "CadQuery", "Prometheus", "RAG", "Liquid cooling", "three.js", "Linux",
];

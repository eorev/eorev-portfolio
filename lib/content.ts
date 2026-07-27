export const SITE = {
  url: "https://eorev-portfolio.vercel.app",
  name: "Ethan Orevillo",
  role: "Backend and infrastructure engineer",
  location: "New Jersey",
  email: "ethanorev@gmail.com",
  github: "https://github.com/eorev",
  linkedin: "https://www.linkedin.com/in/ethan-orevillo",
} as const;

export const SUMMARY = [
  "I build and run backend systems. Full-time at Prudential Financial, where I ship Salesforce Lightning features and internal CRM tooling for the distribution team.",
  "The rest of my time goes to BurntBase, a computer-vision product I co-own. I took over a dormant codebase, rewrote its backend from Laravel to Go, and own everything behind the API: the data layer, the inference services, and the infrastructure they run on.",
] as const;

export type Status = "live" | "development" | "ongoing" | "archived";

export type SystemEntry = {
  index: string;
  name: string;
  /** The entity it is built under, set beside the name. */
  org?: string;
  role: string;
  period: string;
  status: Status;
  stack: string[];
  description: string;
  facts: { label: string; value: string }[];
  href?: string;
  hrefLabel?: string;
};

export const SYSTEMS: SystemEntry[] = [
  {
    index: "01.1",
    name: "BurntBase",
    role: "Co-Owner, Lead Backend Engineer",
    period: "Feb 2026 – present",
    status: "live",
    stack: [
      "Go",
      "PostgreSQL",
      "pgvector",
      "AWS ECS Fargate",
      "Cloudflare R2",
      "Python",
      "PyTorch",
    ],
    description:
      "A computer-vision product for Clash of Clans. A player uploads a screenshot of an enemy base, and BurntBase returns the layouts that match it along with the attack videos that beat them. I own the Go API, the Postgres and pgvector data layer, the Python inference services, and the AWS infrastructure underneath. It serves the web app, the iOS app, and a Discord bot.",
    facts: [
      { label: "Users", value: "Tens of thousands" },
      { label: "Corpus", value: "Hundreds of thousands of indexed layouts" },
      { label: "Index", value: "Tens of millions of structure positions" },
      { label: "Surfaces", value: "Web, iOS, Discord" },
    ],
    href: "https://burntbase.com",
    hrefLabel: "burntbase.com",
  },
  {
    index: "01.2",
    name: "Riptide",
    org: "Seto Labs",
    role: "Solo build",
    period: "2026 – present",
    status: "development",
    stack: [
      "TanStack Start",
      "React",
      "PostgreSQL",
      "Shopify",
      "Stripe",
      "Fly.io",
    ],
    description:
      "A SaaS platform for live-commerce sellers. It ingests Shopify orders into a live queue, shows buyers their position and ETA in real time, and gives sellers an overlay they can put on stream. Multi-tenant auth, Stripe billing and subscription mirroring, webhook ingest, and end-to-end Playwright coverage.",
    facts: [
      { label: "Stage", value: "Hosted test environment, pre-launch" },
      { label: "Integrations", value: "Shopify OAuth, Stripe, Discord" },
    ],
  },
];

export const RESEARCH = {
  title: "Anti-bot research",
  lead: "I reverse engineer commercial bot-mitigation systems. It started as the engineering behind Click Automation and became the thing I do for its own sake.",
  body: "The interesting part is the adversarial loop. Both sides ship weekly, so nothing you learn stays true for long, and the only durable skill is being able to take apart something you have never seen before.",
  fields: [
    {
      label: "Methods",
      value:
        "Browser and TLS fingerprinting, obfuscated JavaScript analysis, sensor-data generation, behavioral detection",
    },
    {
      label: "Systems studied",
      value: "The mitigation stacks in front of Footlocker, Champs, and similar retail",
    },
    {
      label: "Applied in",
      value: "Click Automation, 2018 – 2021",
    },
    {
      label: "Adjacent",
      value:
        "UD CTF; security auditing against CIS benchmarks at Longboard Pharmaceuticals",
    },
  ],
} as const;

export type Role = {
  org: string;
  title: string;
  period: string;
  place: string;
  tags: string[];
  href?: string;
  current?: boolean;
};

export const EXPERIENCE: Role[] = [
  {
    org: "BurntBase",
    title: "Co-Owner, Lead Backend Engineer",
    period: "Feb 2026 – present",
    place: "Remote",
    tags: ["Go", "PostgreSQL", "AWS"],
    href: "https://burntbase.com",
    current: true,
  },
  {
    org: "Prudential Financial",
    title: "Global Tech & Operations Rotation Associate",
    period: "Jul 2025 – present",
    place: "Newark, NJ",
    tags: ["Salesforce Lightning", "Apex", "Aura"],
    href: "https://www.prudential.com/",
    current: true,
  },
  {
    org: "Prudential Financial",
    title: "Software Engineer Intern",
    period: "Jun – Aug 2024",
    place: "Newark, NJ",
    tags: ["TypeScript", "React"],
    href: "https://www.prudential.com/",
  },
  {
    org: "Alpha Kappa Psi",
    title: "Info-Tech Chair",
    period: "Feb 2024 – Feb 2025",
    place: "Newark, DE",
    tags: ["Web", "SEO"],
    href: "https://udelakpsi.com/",
  },
  {
    org: "Longboard Pharmaceuticals",
    title: "Information Technology Intern",
    period: "Jun – Aug 2023",
    place: "San Diego, CA",
    tags: ["Security auditing", "CIS benchmarks"],
    href: "https://www.longboardpharma.com/",
  },
  {
    org: "University of Delaware",
    title: "Teaching Assistant, Computer Science",
    period: "Aug – Dec 2022",
    place: "Newark, DE",
    tags: ["Python", "Instruction"],
    href: "https://www.cis.udel.edu/",
  },
  {
    org: "Click Automation",
    title: "Founder",
    period: "2018 – 2021",
    place: "Remote",
    tags: ["Node", "Electron", "Reverse engineering"],
  },
];

export const STACK: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Go", "TypeScript", "Python", "SQL", "Apex", "C++"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "pgvector", "Redis", "MongoDB"],
  },
  {
    group: "Infrastructure",
    items: [
      "AWS ECS Fargate",
      "Docker",
      "Cloudflare R2",
      "GitHub Actions",
      "Fly.io",
      "Vercel",
    ],
  },
  {
    group: "Vision & ML",
    items: ["PyTorch", "RF-DETR", "YOLOv5", "ONNX"],
  },
  {
    group: "Clients",
    items: ["Next.js", "React", "React Native", "TanStack Start", "Tailwind"],
  },
  {
    group: "Platform",
    items: ["Stripe", "Clerk", "RevenueCat", "Shopify", "Salesforce"],
  },
  {
    group: "Security",
    items: [
      "TLS fingerprinting",
      "Browser fingerprinting",
      "CIS benchmarks",
      "CTF",
    ],
  },
];

/* The human moment in an otherwise clinical document. The photographs
   carry this section; the line below only orients the reader. */
export const LIFE_LEAD = "Some of my favorite moments from recent years.";

export type OrnamentSlot = "masthead" | "life" | "footer";

export type Ornament = {
  slot: OrnamentSlot;
  /** Path under /public/ornaments. Transparent PNG or WebP. */
  src: string;
  w: number;
  h: number;
};

/* Decorative renders. Drop transparent PNGs into public/ornaments, add an
   entry here, and the slot fills. Empty means the page ships undecorated
   rather than showing a gap. */
export const ORNAMENTS: Ornament[] = [];

export type Plate = {
  /** Path under /public/life. */
  src: string;
  /** Intrinsic dimensions, so the strip reserves space and never shifts. */
  w: number;
  h: number;
  /** Short caption printed under the plate number. */
  caption: string;
  /** Describes the photo for anyone who cannot see it. */
  alt: string;
  /** Hand-drawn callout pointing at something inside the frame.
   *  Coordinates are fractions of the frame, origin top-left. */
  annotation?: {
    label: string;
    /** Where the label sits. */
    from: [number, number];
    /** What the squiggle points at. */
    to: [number, number];
  };
};

/* Photographs for the plate strip. The Life section only exists when this
   is non-empty, so the document never shows a hollow section. */
export const PLATES: Plate[] = [
  {
    src: "/life/kualoa.webp",
    w: 2731,
    h: 4096,
    caption: "Kualoa, O‘ahu",
    alt: "Two people looking up at the ridged green cliffs at Kualoa on O‘ahu. The person on the right is a BurntBase co-owner.",
    annotation: {
      label: "BurntBase co-owner",
      from: [0.06, 0.13],
      to: [0.705, 0.452],
    },
  },
  {
    src: "/life/diamond-head.webp",
    w: 2560,
    h: 2154,
    caption: "Diamond Head",
    alt: "A surfer riding along the face of a wave, in black and white.",
  },
  {
    src: "/life/shark-dive.webp",
    w: 2560,
    h: 1920,
    caption: "Shark dive",
    alt: "Overhead black and white shot of a swimmer in open water, a shark passing further out.",
  },
  {
    src: "/life/san-juan.webp",
    w: 1707,
    h: 2560,
    caption: "Old San Juan",
    alt: "Looking out toward the ocean over the green slopes of Old San Juan, Puerto Rico.",
  },
  {
    src: "/life/puerto-rico.webp",
    w: 1440,
    h: 1440,
    caption: "Puerto Rico",
    alt: "Five friends in front of a stone monument in San Juan at night.",
  },
  {
    src: "/life/sunset-lap.webp",
    w: 1920,
    h: 2560,
    caption: "Last run",
    alt: "A snowy slope under a pink and purple sunset, a snowboarder riding down in the foreground.",
  },
  {
    src: "/life/snowboarding.webp",
    w: 1921,
    h: 2560,
    caption: "Ski day",
    alt: "Three people in ski and snowboard gear standing together on a snowy slope under a bright sky.",
  },
  {
    src: "/life/mid-run.webp",
    w: 1920,
    h: 2560,
    caption: "Mid-run, dusk",
    alt: "The nose of a snowboard in the foreground, looking down a floodlit slope toward a pink dusk sky.",
  },
  {
    src: "/life/la-jolla.webp",
    w: 2560,
    h: 1920,
    caption: "La Jolla",
    alt: "A row of tall palm trees silhouetted against an orange sunset over the road in La Jolla.",
  },
  {
    src: "/life/la-jolla-cliffs.webp",
    w: 1240,
    h: 2208,
    caption: "La Jolla cliffs",
    alt: "The coastline at La Jolla, sandstone cliffs curving into the Pacific under a pale sky.",
  },
  {
    src: "/life/lavallette.webp",
    w: 2560,
    h: 1920,
    caption: "Lavallette, New Jersey",
    alt: "The sun setting over Barnegat Bay from the end of a long wooden dock, a boat crossing the light.",
  },
  {
    src: "/life/st-john.webp",
    w: 1920,
    h: 2560,
    caption: "Windmill Bar, St. John",
    alt: "A hilltop bar strung with coloured lights at golden hour, looking out over the islands of the U.S. Virgin Islands.",
  },
  {
    src: "/life/waikiki.webp",
    w: 2560,
    h: 1920,
    caption: "Waikīkī",
    alt: "Waikīkī beach and Diamond Head seen from a high balcony, turquoise water and breaking surf below.",
  },
  {
    src: "/life/poke.webp",
    w: 2560,
    h: 2560,
    caption: "Maguro Spot",
    alt: "An overhead shot of a poke bowl with tuna, salmon, avocado and sea beans, sesame scattered across the top.",
  },
];

export type ArchiveItem = {
  name: string;
  year: string;
  stack: string;
  note: string;
  href: string;
};

export const ARCHIVE: ArchiveItem[] = [
  {
    name: "Local Lens",
    year: "2024",
    stack: "Next.js, TypeScript",
    note: "Civic tool for understanding local politicians. Built at HenHacks 2024.",
    href: "https://github.com/eorev/Local-Lens",
  },
  {
    name: "Shareable Wordle",
    year: "2024",
    stack: "Next.js, MongoDB",
    note: "Custom Wordle puzzles you can generate and send to someone.",
    href: "https://github.com/eorev/shareable-wordle",
  },
  {
    name: "Sorting Visualizer",
    year: "2024",
    stack: "Next.js, TypeScript",
    note: "Sorting algorithms rendered step by step in real time.",
    href: "https://github.com/eorev/sorting-visualizer-2",
  },
  {
    name: "Chirp",
    year: "2023",
    stack: "React, Vite, TypeScript",
    note: "Algorithm-learning game. Best Educational Hack, HenHacks 2023.",
    href: "https://github.com/eorev/Chirp",
  },
  {
    name: "Nestled",
    year: "2023",
    stack: "React, Firebase",
    note: "Furniture catalog and checkout simulation. Coursework, CISC275.",
    href: "https://github.com/eorev/webstore",
  },
];

export const EDUCATION = {
  school: "University of Delaware",
  degree: "BS, Computer Science",
  period: "2021 – 2025",
  activities: ["UD CTF", "ACM", "CS for Social Good", "Alpha Kappa Psi"],
} as const;

export type ProjectEntry = {
  slug: string;
  name: string;
  url: string;
  // Primary screenshot (plain, gets a border in the UI). ".mp4" renders the video composite.
  image: string;
  // Optional extra screenshots stacked below the primary image.
  // Plain strings render without the 1px frame border (device-bezel shots);
  // use { src, border: true } to opt back into the border. An empty string
  // renders a "screenshot soon" placeholder.
  images?: (string | { src: string; border?: boolean })[];
  description: string;
  tags: string[];
};

export const projects: ProjectEntry[] = [
  {
    slug: "locale-center",
    name: "locale.center",
    url: "https://locale.center/",
    image: "https://cdn.degstn.com/localecenter.png",
    images: ["https://cdn.degstn.com/localecenterimage2v2.png"],
    description: "locale.center is a community hub focused on helping people connect with each other and discover local resources in one place. Built with an experience inspired by early Snap Map, it combines support agents and live heatmaps to make participation feel immediate, inclusive, and community-driven.",
    tags: ["web", "community", "tsa"],
  },
  {
    slug: "polyline",
    name: "Polyline",
    url: "https://polyline.ai/",
    image: "https://cdn.degstn.com/polylinev2.png",
    description: "Polyline was an idea that I had when I couldn't get o1-pro to generate geodesic domes for me exactly how I wanted it to. The idea was a GPT-wrapper (typical) but just as Cursor or GitHub Copilot works, it would be a fine tuned GPT-powered tool that could generate Fusion scripts programmatically without getting caught on errors with Fusion's ever changing API.",
    tags: ["ai", "saas"],
  },
  {
    slug: "s7em",
    name: "s7em",
    url: "https://s7em.com/",
    image: "https://cdn.degstn.com/s7emv2.png",
    description: "S7em is the website I built for the 2025 TSA State Conference. It is a simplistic tech-focused restaurant website needed to be focused on STEM as well as how the food was prepared. I worked with a team of 2 to develop the idea which is when I went on to build the website to showcase the idea in the coolest way I could——with ASCII. The whole website is infused with ASCII——with the homepage being a 3D model of the Aston Martin Residences in Miami with a cool twist when you visit the site.",
    tags: ["web", "ascii", "tsa"],
  },
  {
    slug: "limen",
    name: "Limen",
    url: "https://spatialwaypoints.com/",
    image: "https://cdn.degstn.com/limenimage3.png",
    images: ["https://cdn.degstn.com/limenimage4.png", "https://cdn.degstn.com/limenimage2.png"],
    description: "We built an app which allows users to forget about the Doorway effect, or the idea of when we move from one room to another, the doorway in the name represents the boundary between one context (such as a living room) and another (a kitchen) where a user might forget what they were thinking in passing between doorways. The app allows the use of new technologies such as Apple's ARKit, RealityKit, TableTopKit, and more and revolutionary devices such as the Apple Vision Pro.",
    tags: ["ar", "ios", "visionos"],
  },
  {
    slug: "aremac",
    name: "Aremac",
    url: "https://aremac.tech/",
    image: "https://cdn.degstn.com/aremacv4.mp4",
    description: "Aremac is my research‑driven design and rapid‑prototyping studio. I build 3D models, websites, apps, and AI systems for founders—ranging from an AI doctoral assistant to an allergic‑reaction detector—and consult as an engineer from ideation to MVP. I’ve supported multiple seed‑stage teams (incl. UD’s Diamond Challenge finalists) and rebuilt a fashion brand’s web framework to test a streamlined, modern experience.",
    tags: ["hardware", "software"],
  },
  {
    slug: "service-seeker",
    name: "Service Seeker",
    url: "https://docs.google.com/presentation/d/1HR3efx1HpUI6DvxthVhOzCj9JLPVE0YNZ744-EnUHAc/edit?usp=sharing",
    image: "https://cdn.degstn.com/serviceseekerv2.png",
    description: "Service Seeker is a platform that connects individuals with personalized local volunteer opportunities and community service initiatives. It offers a secure, private, and intuitive experience for both users and organizations, leveraging Apple Passkeys for privacy and on-device memory for efficiency. The app makes it easy to find, track, and manage service opportunities, fostering meaningful community engagement.",
    tags: ["presentation", "community service"],
  },
  {
    slug: "stelio",
    name: "Stelio",
    url: "https://stelio.ai/",
    image: "https://cdn.degstn.com/steliov2.png",
    description: "For the 2024 TSA State and National Conferences, I coded our Webmaster project entirely myself in Next.js, TypeScript, and JavaScript, and deployed it on Vercel. The team helped with design and ideas, and we made all graphics and content under Creative Commons. Fully responsive, minimal, and original. Judges said it was the most diverse and inclusive presentation they've seen. The project was one of the first websites I built and led me to build many others.",
    tags: ["web", "team", "energy efficiency"],
  },
  {
    slug: "cad",
    name: "cad",
    url: "https://starwars.degstn.com/",
    image: "https://cdn.degstn.com/cad.png",
    description: "A detailed CAD project inspired by Star Wars, featuring intricate 3D models and engineering design. Built using Fusion 360 and rendered for web viewing. This project showcases advanced modeling techniques and a passion for both engineering and the Star Wars universe.",
    tags: ["cad", "fusion 360", "3d modeling"],
  },
  {
    slug: "aimazing",
    name: "AImazing",
    url: "/404",
    image: "https://cdn.degstn.com/gpts.png",
    description: "Archived project",
    tags: ["ai"],
  },
  {
    slug: "portfolio-archive",
    name: "Portfolio Archive",
    url: "http://web.archive.org/web/20211201034547/https://www.goldy.design/",
    image: "https://cdn.degstn.com/archive.png",
    description: "This is the archived version of my portfolio from 2020 to 2021. It served to showcase my photography of airplanes, and my passion for aviation during COVID-19, representing a time where I could not travel, but I could photograph and capture the beauty of aviation in the meantime.",
    tags: ["photography", "airplanes", "covid-19"],
  },
];

// Site pages previewed in the homepage panel. An empty image shows a
// "screenshot soon" placeholder until real screenshots are uploaded.
export const pages: ProjectEntry[] = [
  {
    slug: "cv",
    name: "cv",
    url: "/cv",
    image: "",
    description: "education, experience, and the rest of the formal rundown.",
    tags: ["page"],
  },
  {
    slug: "photography",
    name: "photography",
    url: "/photography",
    image: "https://cdn.degstn.com/photography.png",
    description: "This page tells the story of my passion in photography and its global scale. every country on this fully interactive globe shares a different collective memory between my grandpa pops and me.",
    tags: ["page"],
  },
  {
    slug: "dg-photos",
    name: "dg.photos",
    url: "https://dg.photos",
    image: "https://cdn.degstn.com/dgphotos.png",
    description: "A separate home for my commerical photography.",
    tags: ["site", "external"],
  },
  {
    slug: "ghorman",
    name: "ghorman",
    url: "/ghorman",
    image: "https://cdn.degstn.com/ghormanv2.png",
    description: "Ghorman is my colombian giant redleg tarantula (megaphobema robustum). this page is a live stream of him alongside some quick facts about him.",
    tags: ["page", "live"],
  },
  {
    slug: "words",
    name: "words",
    url: "/words",
    image: "https://cdn.degstn.com/wordsv2.png",
    description: "Long-form writing, starting with the story of how this portfolio came to be.",
    tags: ["page", "writing"],
  },
  {
    slug: "archive",
    name: "archive",
    url: "/archive",
    image: "",
    description: "Older projects from before 2023 — currently being gathered from old drives and forgotten repos. coming soon.",
    tags: ["page", "archive"],
  },
]; 
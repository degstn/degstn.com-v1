export type PencilItem = {
  slug: string;
  name: string;
  brand: string;
  category: "mechanical-pencil" | "lead" | "eraser" | "other";
  image: string;
  tint: string;
  tipSize?: string;
  material?: string;
  weight?: string;
  color?: string;
  description: string;
};

export const pencils: PencilItem[] = [
  {
    slug: "kayou-aimvision-pro",
    name: "Aimvision Pro 0.5",
    brand: "Kayou+",
    category: "mechanical-pencil",
    image: "https://cdn.degstn.com/aimvision.png",
    tint: "180, 165, 140",
    tipSize: "0.5mm",
    material: "Brass & Iron",
    weight: "25.5g",
    color: "Titanium Gold",
    description:
      "The entire body is carved from brass, giving it serious rigidity and a satisfying heft. The rotary dial displays lead hardness, and the knurled grip with patterned rubber keeps it locked in your hand. The tip-to-ring structure minimizes vibration for dead-accurate lines.",
  },
  {
    slug: "rotring-800-black",
    name: "800 0.5 Black",
    brand: "Rotring",
    category: "mechanical-pencil",
    image: "https://cdn.degstn.com/rotringblack.png",
    tint: "180, 60, 50",
    tipSize: "0.5mm",
    material: "Full Metal",
    weight: "27g",
    color: "Black",
    description:
      "The 800 is the pencil that made me care about pencils. Full-metal hexagonal barrel, twist-and-click retractable tip, brass mechanism, non-slip knurled grip. The sleeve retracts completely for pocket carry. It just works.",
  },
  {
    slug: "rotring-800-silver",
    name: "800 0.5 Silver",
    brand: "Rotring",
    category: "mechanical-pencil",
    image: "https://cdn.degstn.com/rotringsilver.png",
    tint: "180, 60, 50",
    tipSize: "0.5mm",
    material: "Full Metal",
    weight: "27g",
    color: "Silver",
    description:
      "Same legendary 800 mechanism in silver. The lighter finish shows off the machining details and the hexagonal barrel catches light differently. Had to have both.",
  },
  {
    slug: "laconic-solid-write",
    name: "EQP Solid Write 0.5",
    brand: "Laconic",
    category: "mechanical-pencil",
    image: "https://cdn.degstn.com/laconic.png",
    tint: "80, 80, 80",
    tipSize: "0.5mm",
    material: "Metal",
    weight: "23g",
    color: "Matte Black",
    description:
      "149mm of matte rubber-coated metal with a hexagonal anti-roll ring. No clip — intentionally. Laconic designed this to disappear in your hand and let you focus on writing. The weight distribution is perfectly balanced at 23g. Made in Japan.",
  },
  {
    slug: "papermate-sharpwriter",
    name: "SharpWriter #2",
    brand: "Paper Mate",
    category: "mechanical-pencil",
    image: "https://cdn.degstn.com/sharpwriter.png",
    tint: "200, 180, 60",
    tipSize: "0.7mm",
    material: "Plastic",
    weight: "~6g",
    color: "Classic Yellow",
    description:
      "The humble SharpWriter. Twist-to-advance, shock-absorbing tip, Pink Pearl eraser. It costs basically nothing and it's nonrefillable and disposable and I don't care — sometimes you just need a yellow pencil that works. The nostalgia factor is real.",
  },
  {
    slug: "kuru-toga-lead",
    name: "Kuru Toga 0.5mm HB Lead",
    brand: "Uni",
    category: "lead",
    image: "https://cdn.degstn.com/unilead.png",
    tint: "100, 100, 120",
    tipSize: "0.5mm",
    material: "Graphite (dual-layer)",
    weight: "4g",
    color: "Black Case",
    description:
      "Dual-layer composition — soft outer layer around a harder inner core. The lead shapes itself into a point as the Kuru Toga mechanism rotates it. Doesn't smear, doesn't break, writes darker than you'd expect from HB. 20 leads per case.",
  },
  {
    slug: "campus-eraser-medium",
    name: "Campus Student Eraser",
    brand: "Kokuyo",
    category: "eraser",
    image: "https://cdn.degstn.com/campuseraser.png",
    tint: "80, 120, 180",
    material: "Polymer (latex-free)",
    weight: "19g",
    color: "White / Blue Sleeve",
    description:
      "Designed for 2B-4B lead but erases everything cleanly. The polymer blend wraps around graphite marks and lifts them with minimal pressure. Less abrasive than a Mars Plastic, fewer crumbs than a Mono. The sleeper pick of Japanese erasers.",
  },
  {
    slug: "campus-eraser-small",
    name: "Campus Student Eraser (Small)",
    brand: "Kokuyo",
    category: "eraser",
    image: "https://cdn.degstn.com/campuseraser.png",
    tint: "80, 120, 180",
    material: "Polymer (latex-free)",
    weight: "~12g",
    color: "White / Blue Sleeve",
    description:
      "Same Campus eraser formula in a smaller form factor. Lives in the pencil case for on-the-go corrections. Same clean erase, same minimal crumbs — just pocket-sized.",
  },
];

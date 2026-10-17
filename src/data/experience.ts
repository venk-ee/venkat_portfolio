// Work history / "Where I have shipped." data.
//
//   - A company can contain MULTIPLE roles (promotions / re-orgs) without
//     duplicating company metadata.
//   - Each role can list bullets, shipped highlights (with links/tags), and tech.
//   - The `[key: string]: unknown` index signature lets you add arbitrary
//     extra fields to any entry without touching this type or the component;
//     unknown fields are rendered automatically in the UI.
//

export interface ExperienceHighlight {
  title: string;
  description?: string;
  link?: string;
  tags?: string[];
}

export interface ExperienceRole {
  title: string;
  period: string;
  employmentType?: string;
  location?: string;
  summary?: string;
  bullets?: string[];
  highlights?: ExperienceHighlight[];
  tech?: string[];
  [key: string]: unknown;
}

export interface ExperienceCompany {
  company: string;
  link?: string;
  logo?: string;
  location?: string;
  roles: ExperienceRole[];
  [key: string]: unknown;
}

export const experience: ExperienceCompany[] = [
  {
    company: "Naatscorp pvt ltd",
    link: "https://naatscorp.com",
    location: "On-site cbe from 2024",
    roles: [
      {
        title: "AI & ML Engineer",
        period: "2025 — Present",
        employmentType: "Full-time",
        summary: "Owns end-to-end ML delivery for robotics perception.",
        bullets: [
          "Shipped production ML pipelines end to end.",
          "Built real-time inference services for robotics perception.",
        ],
        highlights: [
          {
            title: "Medical device",
            description: "Developed AI-powered medical device for patient monitoring.",
            tags: ["PyTorch", "C++", "opencv"],
          },
        ],
        tech: ["Python", "PyTorch", "C++", "opencv"],
      },
      {
        title: "GET AI & ML Engineer",
        period: "2024 — 2025",
        employmentType: "Full-time",
        bullets: [
          "Prototyped vision models for on-device inference.",
        ],
      },
    ],
  },
  // TODO
  // { 
  //   company: "Company Two",
  //   location: "On-site",
  //   roles: [
  //     {
  //       title: "Machine Learning Engineer",
  //       period: "2022 — 2023",
  //       employmentType: "Full-time",
  //       bullets: [
  //         "Developed computer vision models for industrial inspection.",
  //         "Reduced inference latency by optimizing the serving stack.",
  //       ],
  //       tech: ["Python", "OpenCV", "TensorRT"],
  //     },
  //   ],
  // },
  // {
  //   company: "Research Lab",
  //   location: "University",
  //   roles: [
  //     {
  //       title: "Research Assistant",
  //       period: "2021 — 2022",
  //       employmentType: "Part-time",
  //       bullets: [
  //         "Prototyped 3D reconstruction experiments.",
  //         "Published internal benchmarks and tooling.",
  //       ],
  //     },
  //   ],
  // },
];

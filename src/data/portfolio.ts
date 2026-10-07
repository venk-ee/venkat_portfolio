export interface SocialLink {
  label: string;
  href: string;
}

export interface Portfolio {
  name: string;
  role: string;
  bio: string;
  badgeName: string;
  badgeTitle: string;
  photoUrl: string;
  socials: SocialLink[];
}

export const portfolio: Portfolio = {
  name: "Venkat",
  role: "Software Engineer",
  bio: "Building intelligent machines that see, think, and interact with the physical world. Specializing in computer vision, robotic perception, and real-time 3D systems.",
  badgeName: "VENKATANATHA AV",
  badgeTitle: "AI & ML Engineer",
  photoUrl: "/me.png",
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Email", href: "mailto:venkat@example.com" },
  ],
};

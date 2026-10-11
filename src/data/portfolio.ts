

export interface NavLink {
  label: string; // text shown, "
  href: string; // link target,  "https://..."
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Portfolio {
  name: string; // logo + hero name
  role: string; // subtitle under name
  bio: string; // hero paragraph
  badgeName: string; // 3D card name (single line)
  badgeTitle: string; // 3D card title (single line)
  photoUrl: string; // photo on 3D card, file in /public
  nav: NavLink[]; // header + footer links
  socials: SocialLink[]; // hero buttons + footer links
  copyright: string; // footer bottom line
}

export const portfolio: Portfolio = {
  name: "Venkat",
  role: "Software Engineer",
  bio: "Building intelligent machines that see, think, and interact with the physical world. Specializing in computer vision, robotic perception, and real-time 3D systems.",
  badgeName: "VENKATANATHA AV",
  badgeTitle: "AI & ML Engineer",
  photoUrl: "/me.png",

  // Use "#id" to jump to a section on this page.
  nav: [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Email", href: "mailto:venkat@example.com" },
  ],

  copyright: "© 2026 Venkat. All rights reserved.",
};

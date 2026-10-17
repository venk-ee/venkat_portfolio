

export interface NavLink {
  label: string; // button text
  href: string; // "https://..." or "#id"
}

export interface SocialLink {
  label: string; // button text
  href: string; // "https://..."
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
  name: "Venkatanatha av",
  role: "AI & ML Engineer",
  bio: "",
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

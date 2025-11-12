export interface NavigationLink {
  href: string;
  label: string;
  labelEn: string;
  requiresAdmin?: boolean;
}

export interface NavigationCategory {
  id: string;
  title: string;
  titleEn: string;
  links: NavigationLink[];
}
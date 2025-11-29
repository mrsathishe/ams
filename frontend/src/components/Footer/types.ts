export interface FooterProps {
  variant?: 'default' | 'minimal';
  showQuickLinks?: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface QuickLinkItem {
  label: string;
  href: string;
  external?: boolean;
}
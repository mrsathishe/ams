import logo from "@/assets/logo.png";
import type { FooterProps } from "./types";
import {
  FooterContainer,
  FooterContent,
  FooterSection,
  SectionTitle,
  ContactItem,
  QuickLink,
  CopyrightSection,
  Logo,
  CompanyDescription,
  BrandSection,
  BrandName,
  Tagline
} from "./styles";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" }
];

export default function Footer({ 
  variant = "default", 
  showQuickLinks = true 
}: FooterProps) {

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href;
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        {/* Company Information */}
        <FooterSection>
          <Logo src={logo} alt="APTSYNC Logo" />
          <BrandSection>
            <BrandName>APTSYNC</BrandName>
            <Tagline>Manage Easy</Tagline>
          </BrandSection>
          <CompanyDescription>
            Simplifying apartment management with modern solutions for residents and administrators.
          </CompanyDescription>
        </FooterSection>

        {/* Contact Information */}
        <FooterSection>
          <SectionTitle>Contact Us</SectionTitle>
          <ContactItem>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.16 10.96c1.558 3.502 4.372 6.316 7.874 7.874l1.573-2.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V21a2 2 0 01-2 2h-1C9.716 23 1 14.284 1 3V2a2 2 0 012-2z" />
            </svg>
            +91 - 97900 60943
          </ContactItem>
          <ContactItem>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            mrsathishe@gmail.com
          </ContactItem>
        </FooterSection>

        {/* Quick Links */}
        {showQuickLinks && variant === "default" && (
          <FooterSection>
            <SectionTitle>Quick Links</SectionTitle>
            {quickLinks.map((link, index) => (
              <QuickLink 
                key={index}
                onClick={() => handleLinkClick(link.href)}
                style={{ cursor: 'pointer' }}
              >
                {link.label}
              </QuickLink>
            ))}
          </FooterSection>
        )}

        {/* Copyright Section - spans full width */}
        <CopyrightSection>
          <p>© 2025 APTSYNC. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
            Built with modern technology for better apartment management.
          </p>
        </CopyrightSection>
      </FooterContent>
    </FooterContainer>
  );
}
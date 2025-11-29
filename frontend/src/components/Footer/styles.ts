import styled from "styled-components";
import { respondTo } from "@/styles/breakpoints";

export const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

export const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  ${respondTo.mobile(`
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
    padding: 0 1rem;
  `)}
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 0.5rem;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #cbd5e1;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #60a5fa;
    flex-shrink: 0;
  }

  ${respondTo.mobile(`
    justify-content: center;
  `)}
`;

export const QuickLink = styled.a`
  color: #cbd5e1;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s;
  margin-bottom: 0.5rem;

  &:hover {
    color: #60a5fa;
  }
`;

export const CopyrightSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  padding-top: 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  grid-column: 1 / -1;
`;

export const Logo = styled.img`
  height: 12.5rem;
  width: auto;
  margin-bottom: 0.75rem;

  ${respondTo.mobile(`
    margin: 0 auto 0.75rem;
    display: block;
  `)}
`;

export const CompanyDescription = styled.p`
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0.5rem 0;

  ${respondTo.mobile(`
    text-align: center;
  `)}
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;

  ${respondTo.mobile(`
    align-items: center;
  `)}
`;

export const BrandName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
`;

export const Tagline = styled.span`
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
`;
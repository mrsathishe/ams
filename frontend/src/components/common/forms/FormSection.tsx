import React from "react";
import styled from "styled-components";
import { respondTo } from "@/styles/breakpoints";

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;

  ${respondTo.mobile(`
    padding: 1rem;
    border: none;
    background: transparent;
  `)}
`;

const SectionHeader = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export default function FormSection({
  title,
  children,
  className,
  description
}: FormSectionProps) {
  return (
    <SectionContainer className={className}>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {description && <SectionDescription>{description}</SectionDescription>}
      </SectionHeader>
      <SectionContent>
        {children}
      </SectionContent>
    </SectionContainer>
  );
}
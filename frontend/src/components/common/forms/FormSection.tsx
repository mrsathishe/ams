import React from "react";
import {
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent
} from "./styles";

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
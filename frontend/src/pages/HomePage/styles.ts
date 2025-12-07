import styled from "styled-components";
import { SlButton } from '@shoelace-style/shoelace/dist/react';

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
`;

export const ContentWrapper = styled.div`
  max-width: 28rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: #111827;
  margin: 0 0 0.5rem;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #4b5563;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PrimaryButton = styled(SlButton)`
  width: 100%;
`;

export const SecondaryButton = styled(SlButton)`
  width: 100%;
`;
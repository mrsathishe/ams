import styled from "styled-components";

export const ChartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #374151;
`;

export const LoadingContainer = styled.div`
  padding: 1rem;
  text-align: center;
  color: #6b7280;
`;
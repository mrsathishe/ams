import styled from "styled-components";

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

export const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 6rem;
`;

export const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

export const WelcomeTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
`;

export const WelcomeDescription = styled.p`
  color: #64748b;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' }>`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        `;
      default:
        return `
          background: white;
          color: #1e293b;
        `;
    }
  }}
`;

export const StatCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatCardInfo = styled.div``;

export const StatCardLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.5rem;
  opacity: 0.8;
`;

export const StatCardValue = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
`;

export const StatCardSubtext = styled.p`
  font-size: 0.75rem;
  margin: 0.25rem 0 0;
  opacity: 0.7;
`;

export const StatCardIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 1.5rem;
`;
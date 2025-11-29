import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "@/styles/shared";

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const SummaryValue = styled.span<{ variant?: 'default' | 'success' | 'warning' }>`
  font-weight: 600;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return 'color: #059669;';
      case 'warning':
        return 'color: #d97706;';
      default:
        return 'color: #1e293b;';
    }
  }}
`;

const ProgressBar = styled.div`
  width: 100%;
  background: #e5e7eb;
  border-radius: 9999px;
  height: 0.5rem;
  margin: 1rem 0;
`;

const ProgressFill = styled.div<{ width: string }>`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  height: 100%;
  border-radius: 9999px;
  width: ${props => props.width};
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
`;

export default function Sidebar() {
  return (
    <SidebarContainer>
      {/* Quick Actions Card */}
      <ActionCard>
        <CardTitle>Quick Actions</CardTitle>
        <ActionButtons>
          <Button>Pay Bills</Button>
          <Button variant="outline">View Expenses</Button>
          <Button variant="outline">Download Receipt</Button>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <Button variant="outline" style={{ width: '100%' }}>
              Update Profile
            </Button>
          </Link>
        </ActionButtons>
      </ActionCard>

      {/* Monthly Summary */}
      <ActionCard>
        <CardTitle>November Summary</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SummaryItem>
            <SummaryLabel>Total Bills</SummaryLabel>
            <SummaryValue>6</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Paid Bills</SummaryLabel>
            <SummaryValue variant="success">4</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Pending</SummaryLabel>
            <SummaryValue variant="warning">2</SummaryValue>
          </SummaryItem>
          <ProgressBar>
            <ProgressFill width="67%" />
          </ProgressBar>
          <ProgressText>67% completed</ProgressText>
        </div>
      </ActionCard>
    </SidebarContainer>
  );
}
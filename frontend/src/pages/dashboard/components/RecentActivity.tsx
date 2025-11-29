import React from "react";
import styled from "styled-components";
import { Button } from "@/styles/shared";

const ActivityCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ActivityTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #f9fafb;
  }
`;

const ActivityItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActivityIcon = styled.div`
  font-size: 1.5rem;
`;

const ActivityInfo = styled.div``;

const ActivityDescription = styled.p`
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivityBadge = styled.span<{ type: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  
  ${props => {
    switch (props.type) {
      case 'paid':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'overdue':
        return `
          background: #fecaca;
          color: #991b1b;
        `;
      default:
        return `
          background: #e0e7ff;
          color: #3730a3;
        `;
    }
  }}
`;

const ActivityDate = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ActivityAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
`;

interface Activity {
  type: string;
  amount: number;
  desc: string;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getStatusIcon = (type: string) => {
    switch (type) {
      case "paid": return "✅";
      case "pending": return "⏳";
      case "overdue": return "⚠️";
      default: return "ℹ️";
    }
  };

  return (
    <ActivityCard>
      <ActivityHeader>
        <ActivityTitle>Recent Activity</ActivityTitle>
        <Button variant="outline">View All</Button>
      </ActivityHeader>
      
      <ActivityList>
        {activities.map((activity, index) => (
          <ActivityItem key={index}>
            <ActivityItemContent>
              <ActivityIcon>
                {getStatusIcon(activity.type)}
              </ActivityIcon>
              <ActivityInfo>
                <ActivityDescription>{activity.desc}</ActivityDescription>
                <ActivityMeta>
                  <ActivityBadge type={activity.type}>
                    {activity.type}
                  </ActivityBadge>
                  <ActivityDate>{activity.date}</ActivityDate>
                </ActivityMeta>
              </ActivityInfo>
            </ActivityItemContent>
            <ActivityAmount>₹{activity.amount.toLocaleString()}</ActivityAmount>
          </ActivityItem>
        ))}
      </ActivityList>
    </ActivityCard>
  );
}
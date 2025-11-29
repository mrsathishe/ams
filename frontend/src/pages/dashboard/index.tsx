import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import Header from "@/components/Header";
import StatsCard from "./components/StatsCard";
import RecentActivity from "./components/RecentActivity";
import Sidebar from "./components/Sidebar";
import {
  DashboardContainer,
  MainContent,
  WelcomeSection,
  WelcomeTitle,
  WelcomeDescription,
  StatsGrid,
  ContentGrid
} from "./styles";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const [stats] = useState({
    totalExpenses: 12450,
    pendingPayments: 3200,
    paidThisMonth: 8750,
    savings: 2100,
  });

  const [recentActivity] = useState([
    { type: "paid", amount: 1200, desc: "Electricity Bill - Nov 2025", date: "2 days ago" },
    { type: "pending", amount: 800, desc: "Water Bill - Nov 2025", date: "5 days ago" },
    { type: "overdue", amount: 1500, desc: "Maintenance Fee - Oct 2025", date: "1 week ago" },
  ]);

  return (
    <DashboardContainer>
      {/* Header with user profile */}
      <Header 
        user={user ? {
          name: user.name,
          email: user.email,
          avatar: undefined // You can add avatar URL here if available
        } : undefined}
      />

      {/* Main Content */}
      <MainContent>
        {/* Welcome Section */}
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back, {user?.name}!
          </WelcomeTitle>
          <WelcomeDescription>
            Here's your apartment management dashboard overview
          </WelcomeDescription>
        </WelcomeSection>

        {/* Stats Grid */}
        <StatsGrid>
          <StatsCard
            title="Total Expenses"
            value={`₹${stats.totalExpenses.toLocaleString()}`}
            subtitle="This month"
            icon="💰"
            variant="primary"
          />
          <StatsCard
            title="Pending Payments"
            value={`₹${stats.pendingPayments.toLocaleString()}`}
            subtitle="Needs attention"
            icon="⏳"
            variant="warning"
          />
          <StatsCard
            title="Paid This Month"
            value={`₹${stats.paidThisMonth.toLocaleString()}`}
            subtitle="On track"
            icon="✅"
            variant="success"
          />
          <StatsCard
            title="Monthly Savings"
            value={`₹${stats.savings.toLocaleString()}`}
            subtitle="Great job!"
            icon="📈"
          />
        </StatsGrid>

        <ContentGrid>
          {/* Recent Activity */}
          <RecentActivity activities={recentActivity} />
          
          {/* Sidebar */}
          <Sidebar />
        </ContentGrid>
      </MainContent>
    </DashboardContainer>
  );
}
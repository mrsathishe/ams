import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardInfo,
  StatCardLabel,
  StatCardValue,
  StatCardSubtext,
  StatCardIcon
} from "../styles";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export default function StatsCard({ title, value, subtitle, icon, variant }: StatsCardProps) {
  return (
    <StatCard variant={variant}>
      <StatCardContent>
        <StatCardInfo>
          <StatCardLabel>{title}</StatCardLabel>
          <StatCardValue>{value}</StatCardValue>
          <StatCardSubtext>{subtitle}</StatCardSubtext>
        </StatCardInfo>
        <StatCardIcon>{icon}</StatCardIcon>
      </StatCardContent>
    </StatCard>
  );
}
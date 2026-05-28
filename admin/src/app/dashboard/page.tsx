'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsCount = await getCountFromServer(collection(db, 'products'));
        const ordersCount = await getCountFromServer(collection(db, 'orders'));
        const usersCount = await getCountFromServer(collection(db, 'users'));

        setStats({
          products: productsCount.data().count,
          orders: ordersCount.data().count,
          users: usersCount.data().count,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container>
      <Header>
        <div>
          <Title>Dashboard Overview</Title>
          <Subtitle>Real-time metrics for Swarnika</Subtitle>
        </div>
        <DatePill>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </DatePill>
      </Header>

      <StatsGrid>
        <StatCard $delay="0.1s">
          <StatIconWrapper $color="primary">
            <Package size={24} />
          </StatIconWrapper>
          <StatInfo>
            <StatTitle>Total Products</StatTitle>
            <StatValue>{loading ? '-' : stats.products}</StatValue>
            <TrendBadge $positive><TrendingUp size={14} /> +12%</TrendBadge>
          </StatInfo>
        </StatCard>
        
        <StatCard $delay="0.2s">
          <StatIconWrapper $color="secondary">
            <ShoppingBag size={24} />
          </StatIconWrapper>
          <StatInfo>
            <StatTitle>Total Orders</StatTitle>
            <StatValue>{loading ? '-' : stats.orders}</StatValue>
            <TrendBadge $positive><TrendingUp size={14} /> +8%</TrendBadge>
          </StatInfo>
        </StatCard>

        <StatCard $delay="0.3s">
          <StatIconWrapper $color="tertiary">
            <Users size={24} />
          </StatIconWrapper>
          <StatInfo>
            <StatTitle>Registered Users</StatTitle>
            <StatValue>{loading ? '-' : stats.users}</StatValue>
            <TrendBadge $positive><TrendingUp size={14} /> +24%</TrendBadge>
          </StatInfo>
        </StatCard>
      </StatsGrid>
      
      {/* Decorative luxury elements could go here like recent orders previews */}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
`;

const DatePill = styled.div`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const StatCard = styled.div<{ $delay: string }>`
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  animation-delay: ${({ $delay }) => $delay};
  transition: all ${({ theme }) => theme.transitions.normal};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(212, 175, 55, 0.3);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);

    &::before {
      opacity: 1;
    }
  }
`;

const StatIconWrapper = styled.div<{ $color: 'primary' | 'secondary' | 'tertiary' }>`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color, theme }) => 
    $color === 'primary' ? `linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))` :
    $color === 'secondary' ? `linear-gradient(135deg, rgba(74,222,128,0.2), rgba(74,222,128,0.05))` :
    `linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.05))`};
  color: ${({ $color, theme }) => 
    $color === 'primary' ? theme.colors.primary :
    $color === 'secondary' ? theme.colors.success :
    '#60a5fa'};
  border: 1px solid ${({ $color, theme }) => 
    $color === 'primary' ? `rgba(212,175,55,0.2)` :
    $color === 'secondary' ? `rgba(74,222,128,0.2)` :
    `rgba(96,165,250,0.2)`};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatTitle = styled.h3`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
`;

const TrendBadge = styled.div<{ $positive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $positive, theme }) => $positive ? theme.colors.success : theme.colors.danger};
  background: ${({ $positive }) => $positive ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)'};
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  width: fit-content;
`;

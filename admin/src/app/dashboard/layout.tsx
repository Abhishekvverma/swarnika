'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Package, ShoppingBag, Users, Tag, Diamond, Grid, Bell } from 'lucide-react';
import { NotificationListener } from '@/components/NotificationListener';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/dashboard', exact: true, icon: <LayoutDashboard size={20} /> },
    { label: 'Products', path: '/dashboard/products', icon: <Diamond size={20} /> },
    { label: 'Categories', path: '/dashboard/categories', icon: <Grid size={20} /> },
    { label: 'Orders', path: '/dashboard/orders', icon: <ShoppingBag size={20} /> },
    { label: 'Coupons', path: '/dashboard/coupons', icon: <Tag size={20} /> },
    { label: 'Users', path: '/dashboard/users', icon: <Users size={20} /> },
    { label: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={20} /> },
  ];

  return (
    <Container>
      <NotificationListener />
      <Sidebar>
        <SidebarHeader>
          <LogoArea>
            <LogoIcon>✨</LogoIcon>
            <div>
              <Logo>LuxeAdmin</Logo>
              <RoleBadge>Administrator</RoleBadge>
            </div>
          </LogoArea>
        </SidebarHeader>

        <NavMenu>
          {navItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.path 
              : pathname.startsWith(item.path);

            return (
              <NavLink key={item.path} href={item.path} $active={isActive}>
                <IconWrapper $active={isActive}>{item.icon}</IconWrapper>
                {item.label}
              </NavLink>
            );
          })}
        </NavMenu>

        <SidebarFooter>
          <UserProfile>
            <UserAvatar>{user?.email?.charAt(0).toUpperCase() || 'A'}</UserAvatar>
            <UserInfo>
              <UserName>Admin</UserName>
              <UserEmail>{user?.email}</UserEmail>
            </UserInfo>
          </UserProfile>
          <LogoutButton onClick={logout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <TopBar>
          <TopBarTitle>Welcome back, Admin</TopBarTitle>
          <TopBarActions>
             <UserAvatar $small>{user?.email?.charAt(0).toUpperCase() || 'A'}</UserAvatar>
          </TopBarActions>
        </TopBar>
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.aside`
  width: 280px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 4px 0 24px rgba(0,0,0,0.2);
`;

const SidebarHeader = styled.div`
  padding: 32px 24px;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  font-size: 24px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Logo = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2px;
  letter-spacing: 0.5px;
`;

const RoleBadge = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const IconWrapper = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.textMuted};
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.text};
  background: ${({ $active, theme }) => $active ? `linear-gradient(135deg, ${theme.colors.primaryDark}, ${theme.colors.primary})` : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ $active, theme }) => $active ? theme.shadows.glow : 'none'};

  &:hover {
    background: ${({ $active, theme }) => $active ? '' : 'rgba(255,255,255,0.03)'};
    color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.primary};
    
    ${IconWrapper} {
      color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.primary};
    }
  }
`;

const SidebarFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid rgba(255,255,255,0.05);
`;

const UserAvatar = styled.div<{ $small?: boolean }>`
  width: ${({ $small }) => $small ? '32px' : '40px'};
  height: ${({ $small }) => $small ? '32px' : '40px'};
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${({ $small }) => $small ? '14px' : '16px'};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  overflow: hidden;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2px;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(248, 113, 113, 0.1);
    color: ${({ theme }) => theme.colors.danger};
    border-color: rgba(248, 113, 113, 0.3);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const TopBar = styled.header`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(18, 18, 20, 0.8);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const TopBarTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ContentArea = styled.div`
  padding: 40px;
  flex: 1;
  animation: fadeIn 0.4s ease-in-out;
`;

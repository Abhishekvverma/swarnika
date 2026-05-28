'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Package, ShoppingBag, Users, Tag, Diamond, Grid, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { NotificationListener } from '@/components/NotificationListener';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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
      <Sidebar $collapsed={isCollapsed}>
        <SidebarHeader>
          <LogoArea $collapsed={isCollapsed}>
            <LogoIcon>✨</LogoIcon>
            <LogoText $collapsed={isCollapsed}>
              <Logo>Swarnika</Logo>
              <RoleBadge>Administrator</RoleBadge>
            </LogoText>
          </LogoArea>
          <CollapseToggle onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </CollapseToggle>
        </SidebarHeader>

        <NavMenu $collapsed={isCollapsed}>
          {navItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.path 
              : pathname.startsWith(item.path);

            return (
              <NavLink key={item.path} href={item.path} $active={isActive} $collapsed={isCollapsed} title={isCollapsed ? item.label : ''}>
                <IconWrapper $active={isActive} $collapsed={isCollapsed}>{item.icon}</IconWrapper>
                <LinkLabel $collapsed={isCollapsed}>{item.label}</LinkLabel>
              </NavLink>
            );
          })}
        </NavMenu>

        <SidebarFooter $collapsed={isCollapsed}>
          <UserProfile $collapsed={isCollapsed}>
            <UserAvatar>{user?.email?.charAt(0).toUpperCase() || 'A'}</UserAvatar>
            <UserInfo $collapsed={isCollapsed}>
              <UserName>Admin</UserName>
              <UserEmail>{user?.email}</UserEmail>
            </UserInfo>
          </UserProfile>
          <LogoutButton onClick={logout} $collapsed={isCollapsed} title={isCollapsed ? "Sign Out" : ""}>
            <LogOut size={18} />
            <LinkLabel $collapsed={isCollapsed}>Sign Out</LinkLabel>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent $collapsed={isCollapsed}>
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

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => $collapsed ? '80px' : '280px'};
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
  transition: width ${({ theme }) => theme.transitions.normal};
`;

const SidebarHeader = styled.div`
  padding: 32px 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100px;
`;

const CollapseToggle = styled.button`
  position: absolute;
  right: -12px;
  top: 40px;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 101;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const LogoArea = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const LogoText = styled.div<{ $collapsed: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  width: ${({ $collapsed }) => $collapsed ? 0 : 'auto'};
  transform: translateX(${({ $collapsed }) => $collapsed ? '-10px' : '0'});
  transition: all ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  white-space: nowrap;
`;

const LogoIcon = styled.div`
  font-size: 24px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  flex-shrink: 0;
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

const NavMenu = styled.nav<{ $collapsed: boolean }>`
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.1);
    border-radius: 4px;
  }
`;

const IconWrapper = styled.div<{ $active?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.textMuted};
  min-width: ${({ $collapsed }) => $collapsed ? '48px' : '20px'};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const LinkLabel = styled.span<{ $collapsed: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  width: ${({ $collapsed }) => $collapsed ? 0 : 'auto'};
  transform: translateX(${({ $collapsed }) => $collapsed ? '-10px' : '0'});
  transition: all ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  white-space: nowrap;
`;

const NavLink = styled(Link)<{ $active?: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $collapsed }) => $collapsed ? '0' : '12px'};
  padding: ${({ $collapsed }) => $collapsed ? '14px 0' : '14px 16px'};
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.text};
  background: ${({ $active, theme }) => $active ? `linear-gradient(135deg, ${theme.colors.primaryDark}, ${theme.colors.primary})` : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ $active, theme }) => $active ? theme.shadows.glow : 'none'};
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) => $active ? '' : 'rgba(255,255,255,0.03)'};
    color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.primary};
    
    ${IconWrapper} {
      color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.primary};
    }
  }
`;

const SidebarFooter = styled.div<{ $collapsed: boolean }>`
  padding: ${({ $collapsed }) => $collapsed ? '24px 16px' : '24px'};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UserProfile = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  padding: ${({ $collapsed }) => $collapsed ? '8px' : '12px'};
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

const UserInfo = styled.div<{ $collapsed: boolean }>`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  width: ${({ $collapsed }) => $collapsed ? 0 : 'auto'};
  transform: translateX(${({ $collapsed }) => $collapsed ? '-10px' : '0'});
  transition: all ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  white-space: nowrap;
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

const LogoutButton = styled.button<{ $collapsed: boolean }>`
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
  gap: ${({ $collapsed }) => $collapsed ? '0' : '8px'};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(248, 113, 113, 0.1);
    color: ${({ theme }) => theme.colors.danger};
    border-color: rgba(248, 113, 113, 0.3);
  }
`;

const MainContent = styled.main<{ $collapsed: boolean }>`
  flex: 1;
  margin-left: ${({ $collapsed }) => $collapsed ? '80px' : '280px'};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left ${({ theme }) => theme.transitions.normal};
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

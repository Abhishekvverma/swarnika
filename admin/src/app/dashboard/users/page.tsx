'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setUsers(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Users</Title>
        <Subtitle>Overview of registered customers.</Subtitle>
      </Header>

      <TableContainer>
        {loading ? (
          <LoadingText>Loading users...</LoadingText>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name / Email Component</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><strong>{u.email || u.id}</strong></td>
                  <td>Customer</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center' }}>No users found in collection.</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
  }

  th {
    background: rgba(255, 255, 255, 0.02);
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
  }
`;

const LoadingText = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

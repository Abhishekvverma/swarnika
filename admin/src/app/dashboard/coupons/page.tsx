'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'coupons'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Coupon[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Coupon);
      });
      setCoupons(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'coupons'), {
        code: code.toUpperCase(),
        discountPercentage: Number(discountPercentage),
        active: true,
      });
      setCode('');
      setDiscountPercentage('');
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding coupon:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Delete this coupon?')) {
      await deleteDoc(doc(db, 'coupons', id));
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Coupons Management</Title>
          <Subtitle>Create discount codes (e.g., SAVE10).</Subtitle>
        </div>
        <AddButton onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Coupon'}
        </AddButton>
      </Header>

      {showAddForm && (
        <FormBox onSubmit={handleAddCoupon}>
          <FormGrid>
            <FormGroup>
              <Label>Discount Code</Label>
              <Input required value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SUMMER20" style={{ textTransform: 'uppercase' }} />
            </FormGroup>
            <FormGroup>
              <Label>Discount Percentage (%)</Label>
              <Input required type="number" max="100" min="1" value={discountPercentage} onChange={e => setDiscountPercentage(e.target.value)} placeholder="10" />
            </FormGroup>
          </FormGrid>
          <SubmitButton type="submit">Save Coupon</SubmitButton>
        </FormBox>
      )}

      <TableContainer>
        {loading ? (
          <LoadingText>Loading coupons...</LoadingText>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.discountPercentage}% Off</td>
                  <td>
  <StatusBadge $active={c.active}>
    {c.active ? 'Active' : 'Inactive'}
  </StatusBadge>
</td>
                  <td>
                    <DeleteBtn onClick={() => handleDelete(c.id)}>Delete</DeleteBtn>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No coupons found. Create some!</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 14px;
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

const FormBox = styled.form`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 30px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

const TableContainer = styled.div`
  background: white;
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
    color: #000;

  }

  th {
    background: #fafafa;
    color: #666;
    font-weight: 500;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#e6f4ea' : '#fce8e6')};
  color: ${({ $active }) => ($active ? '#1e8e3e' : '#d93025')};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;
const LoadingText = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
`;

const DeleteBtn = styled.button`
  color: ${({ theme }) => theme.colors.danger};
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

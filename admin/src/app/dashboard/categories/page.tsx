'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Category {
  id: string;
  name: string;
  img: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [img, setImg] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'categories'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Category[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Category);
      });
      setCategories(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'categories'), {
        name,
        img,
      });
      setName('');
      setImg('');
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Delete this category?')) {
      await deleteDoc(doc(db, 'categories', id));
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Categories Management</Title>
          <Subtitle>Create and manage product categories.</Subtitle>
        </div>
        <AddButton onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Category'}
        </AddButton>
      </Header>

      {showAddForm && (
        <FormBox onSubmit={handleAddCategory}>
          <FormGrid>
            <FormGroup>
              <Label>Category Name</Label>
              <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rings" />
            </FormGroup>
            <FormGroup>
              <Label>Image URL</Label>
              <Input required type="url" value={img} onChange={e => setImg(e.target.value)} placeholder="https://..." />
            </FormGroup>
          </FormGrid>
          <SubmitButton type="submit">Save Category</SubmitButton>
        </FormBox>
      )}

      <TableContainer>
        {loading ? (
          <LoadingText>Loading categories...</LoadingText>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>
                    <ImagePreview>
                      {c.img ? <img src={c.img} alt={c.name} /> : <span>No Image</span>}
                    </ImagePreview>
                  </td>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <DeleteBtn onClick={() => handleDelete(c.id)}>Delete</DeleteBtn>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center' }}>No categories found. Create some!</td></tr>
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
  background: ${({ theme }) => theme.colors.surface};
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
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
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
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
  }
`;

const ImagePreview = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LoadingText = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
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

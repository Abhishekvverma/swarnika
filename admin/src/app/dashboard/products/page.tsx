'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isPopular: boolean;
  createdAt: Timestamp | Date;
  
  // Gold fields
  purity: string;
  weight: number;
  makingCharges: number;
  stoneCharges?: number;
  totalPrice: number;
  description?: string;
  gender?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ring');
  const [image, setImage] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('Unisex');

  // Gold states
  const [purity, setPurity] = useState('22K');
  const [weight, setWeight] = useState('');
  const [makingCharges, setMakingCharges] = useState('');
  const [stoneCharges, setStoneCharges] = useState('');

  const GOLD_RATE = 6000; // ₹ per gram (static for now)

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setName('');
    setCategory('Ring');
    setImage('');
    setIsPopular(false);
    setPurity('22K');
    setWeight('');
    setMakingCharges('');
    setStoneCharges('');
    setDescription('');
    setGender('Unisex');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalPrice =
      Number(weight) * GOLD_RATE +
      Number(makingCharges) +
      Number(stoneCharges || 0);

    try {
      const productData = {
        name,
        category,
        image: image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        isPopular,
        description,
        gender,
        purity,
        weight: Number(weight),
        makingCharges: Number(makingCharges),
        stoneCharges: Number(stoneCharges || 0),
        totalPrice,
        price: totalPrice,
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: Timestamp.now()
        });
      }
      
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please check your permissions.");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setImage(product.image);
    setIsPopular(product.isPopular);
    setPurity(product.purity || '22K');
    setWeight(product.weight?.toString() || '');
    setMakingCharges(product.makingCharges?.toString() || '');
    setStoneCharges(product.stoneCharges?.toString() || '');
    setDescription(product.description || '');
    setGender(product.gender || 'Unisex');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Products Management</Title>
          <Subtitle>Add, edit, or remove your luxury jewelry items.</Subtitle>
        </div>
        <HeaderActions>
          <SearchWrapper>
            <Search size={18} />
            <SearchInput 
              placeholder="Search by name or category..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
          <AddButton onClick={showAddForm ? resetForm : () => setShowAddForm(true)} $cancel={showAddForm}>
            {showAddForm ? 'Cancel' : <><Plus size={18} /> Add Product</>}
          </AddButton>
        </HeaderActions>
      </Header>

      {showAddForm && (
        <FormBox onSubmit={handleSubmit}>
          <FormTitle>{editingId ? 'Edit Product' : 'Add New Product'}</FormTitle>
          <FormGrid>
            <FormGroup>
              <Label>Product Name</Label>
              <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Diamond Ring" />
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Ring">Ring</option>
                <option value="Necklace">Necklace</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Earrings">Earrings</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Gender target</Label>
              <Select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="Unisex">Unisex</option>
                <option value="Women">Women</option>
                <option value="Men">Men</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Gold Purity</Label>
              <Select value={purity} onChange={e => setPurity(e.target.value)}>
                <option value="24K">24K</option>
                <option value="22K">22K</option>
                <option value="18K">18K</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Weight (g)</Label>
              <Input required type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 15.5" />
            </FormGroup>

            <FormGroup>
              <Label>Making Charges (₹)</Label>
              <Input required type="number" value={makingCharges} onChange={e => setMakingCharges(e.target.value)} placeholder="0" />
            </FormGroup>

            <FormGroup>
              <Label>Stone Charges (₹)</Label>
              <Input type="number" value={stoneCharges} onChange={e => setStoneCharges(e.target.value)} placeholder="0" />
            </FormGroup>

            <FormGroup style={{ gridColumn: 'span 2' }}>
              <Label>Image URL</Label>
              <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
            </FormGroup>

            <FormGroup style={{ gridColumn: 'span 2' }}>
              <Label>Description</Label>
              <TextArea value={description} onChange={e => setDescription(e.target.value)} placeholder="Product description..." />
            </FormGroup>
          </FormGrid>
          
          <CheckboxGroup className="checkbox-wrapper">
            <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} id="popular" className="custom-checkbox" />
            <label htmlFor="popular">Mark as "Popular" (Features on Home Screen)</label>
          </CheckboxGroup>
          
          <SubmitButton type="submit">{editingId ? 'Update Product' : 'Save Product'}</SubmitButton>
        </FormBox>
      )}

      <TableContainer>
        {loading ? (
          <LoadingText>Loading products...</LoadingText>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <ProductInfo>
                      <ProductImage src={p.image} alt={p.name} />
                      <div>
                        <ProductName>{p.name}</ProductName>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                          {p.weight ? `${p.weight}g • ${p.purity}` : 'Details M/A'}
                        </div>
                      </div>
                    </ProductInfo>
                  </td>
                  <td>
                    <CategoryBadge>{p.category}</CategoryBadge>
                  </td>
                  <td><PriceText>₹{(p.totalPrice || p.price || 0).toLocaleString()}</PriceText></td>
                  <td>
                    {p.isPopular ? (
                        <StatusBadge $popular>Popular</StatusBadge>
                    ) : (
                        <StatusBadge>Standard</StatusBadge>
                    )}
                  </td>
                  <td>
                    <ActionButtons>
                      <IconButton onClick={() => handleEditClick(p)}>
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton $danger onClick={() => handleDelete(p.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    {products.length === 0 ? 'No products found. Add some to get started!' : 'No matching products found.'}
                  </td>
                </tr>
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
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
`;

const AddButton = styled.button<{ $cancel?: boolean }>`
  background: ${({ $cancel, theme }) => $cancel ? 'transparent' : `linear-gradient(135deg, ${theme.colors.primaryDark}, ${theme.colors.primary})`};
  color: ${({ $cancel, theme }) => $cancel ? theme.colors.textMuted : theme.colors.secondary};
  border: 1px solid ${({ $cancel, theme }) => $cancel ? theme.colors.border : 'transparent'};
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ $cancel, theme }) => $cancel ? 'none' : theme.shadows.glow};

  &:hover {
    transform: translateY(-2px);
    ${({ $cancel, theme }) => $cancel ? `
      color: ${theme.colors.white};
      border-color: ${theme.colors.textMuted};
    ` : `
      box-shadow: 0 6px 20px rgba(212,175,55,0.4);
    `}
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  svg {
    position: absolute;
    left: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px 10px 40px;
  background: rgba(255,255,255,0.02);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  width: 250px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255,255,255,0.05);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }
`;

const FormBox = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  padding: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 30px;
  animation: slideUp 0.4s ease-out;
`;

const FormTitle = styled.h2`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255,255,255,0.05);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  transition: all 0.2s;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255,255,255,0.05);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  
  option {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};

  input[type="checkbox"] {
    appearance: none;
    background-color: transparent;
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 20px;
    height: 20px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    display: grid;
    place-content: center;
    cursor: pointer;

    &::before {
      content: "";
      width: 10px;
      height: 10px;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em ${({ theme }) => theme.colors.primary};
      transform-origin: center;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }

    &:checked {
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &:checked::before {
      transform: scale(1);
    }
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  animation: slideUp 0.6s ease-out backwards;
  animation-delay: 0.1s;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px 24px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 14px;
  }

  th {
    background: rgba(255,255,255,0.02);
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  tr {
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background: rgba(255,255,255,0.01);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductName = styled.strong`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
`;

const CategoryBadge = styled.span`
  background: rgba(255,255,255,0.05);
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.1);
`;

const StatusBadge = styled.span<{ $popular?: boolean }>`
  background: ${({ $popular, theme }) => $popular ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)'};
  color: ${({ $popular, theme }) => $popular ? theme.colors.primary : theme.colors.textMuted};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${({ $popular, theme }) => $popular ? 'rgba(212,175,55,0.3)' : 'transparent'};
`;

const PriceText = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.textMuted};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $danger }) => $danger ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)'};
    border-color: ${({ $danger }) => $danger ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.1)'};
    color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.white};
  }
`;

const LoadingText = styled.div`
  padding: 60px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;
'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Order {
  id: string;
  userId: string;
  shippingDetails: {
    name: string;
    address: string;
    city: string;
    zipCode?: string;
  };
  items?: any[];
  total: number;
  status: string;
  createdAt: any;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: newStatus
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Orders Management</Title>
        <Subtitle>Track and update customer orders.</Subtitle>
      </Header>

      <TableContainer>
        {loading ? (
          <LoadingText>Loading orders...</LoadingText>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 8)}...</td>
                  <td><strong>{o.shippingDetails?.name || 'Unknown'}</strong></td>
                  <td>{o.shippingDetails?.city || '-'}</td>
                  <td>₹{o.total?.toLocaleString() || 0}</td>
                  <td>
                    <Select 
                      value={o.status || 'processing'} 
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  </td>
                  <td>
                    <ViewBtn onClick={() => { setSelectedOrder(o); setModalOpen(true); }}>View</ViewBtn>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No orders found.</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </TableContainer>

      {modalOpen && selectedOrder && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h2>Order Details</h2>
              <CloseBtn onClick={() => setModalOpen(false)}>×</CloseBtn>
            </ModalHeader>
            <ModalBody>
              <Section>
                <h3>Order ID</h3>
                <p>{selectedOrder.id}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
              </Section>
              <Section>
                <h3>Customer Info</h3>
                <p><strong>Name:</strong> {selectedOrder.shippingDetails?.name || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingDetails?.address || 'N/A'}, {selectedOrder.shippingDetails?.city || ''} {selectedOrder.shippingDetails?.zipCode || ''}</p>
              </Section>
              <Section>
                <h3>Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <ItemList>
                    {selectedOrder.items.map((item, idx) => (
                      <ItemRow key={idx}>
                        <span>{item.quantity || 1} x {item.name} {item.size ? `(Size: ${item.size})` : ''}</span>
                        <span>₹{item.price?.toLocaleString()}</span>
                      </ItemRow>
                    ))}
                  </ItemList>
                ) : (
                  <p>No items found.</p>
                )}
              </Section>
              <Section>
                <h3>Order Total</h3>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{selectedOrder.total?.toLocaleString() || 0}</p>
              </Section>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 40px;
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
  color: #666;
  font-size: 14px;
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

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 13px;
  background: white;
  cursor: pointer;
`;

const LoadingText = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
`;

const ViewBtn = styled.button`
  background: #000;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  
  &:hover {
    background: #333;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 12px;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows?.lg || '0 10px 25px rgba(0,0,0,0.2)'};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  
  h2 {
    margin: 0;
    font-size: 20px;
    color: ${({ theme }) => theme.colors?.text || '#000'};
  }
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.textMuted || '#666'};
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 24px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors?.textMuted || '#888'};
    letter-spacing: 0.5px;
  }
  
  p {
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors?.text || '#333'};
    font-size: 15px;
  }
`;

const ItemList = styled.div`
  border: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  border-radius: 8px;
  overflow: hidden;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.text || '#333'};
  
  &:last-child {
    border-bottom: none;
  }
`;

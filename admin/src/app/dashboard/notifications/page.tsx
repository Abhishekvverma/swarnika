'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Send, Bell, Smartphone, Users } from 'lucide-react';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [pushTokens, setPushTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const tokens: string[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.pushToken && data.pushToken.startsWith('ExponentPushToken')) {
            tokens.push(data.pushToken);
          }
        });
        setPushTokens(tokens);
      } catch (error) {
        console.error('Error fetching push tokens:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchTokens();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    if (pushTokens.length === 0) {
      alert('No user device tokens found to send notifications to.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: pushTokens,
          title,
          body: message,
          data: { customData: 'luxeGemsPromo' }
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully sent notification to ${data.count} devices!`);
        setTitle('');
        setMessage('');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      alert('Failed to send notifications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Push Notifications</Title>
          <Subtitle>Send marketing and transactional alerts to your mobile users.</Subtitle>
        </div>
      </Header>

      <MetricsGrid>
        <MetricCard>
          <MetricIcon $color="#10B981">
            <Smartphone size={24} color="#FFF" />
          </MetricIcon>
          <MetricInfo>
            <MetricValue>{fetching ? '...' : pushTokens.length}</MetricValue>
            <MetricLabel>Registered Devices</MetricLabel>
          </MetricInfo>
        </MetricCard>
      </MetricsGrid>

      <FormCard onSubmit={handleSend}>
        <SectionTitle>Compose Broadcast</SectionTitle>
        <FormGroup>
          <Label>Notification Title</Label>
          <Input 
            type="text" 
            placeholder="e.g. New Collection Arrived! ✨" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={60}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Message Body</Label>
          <TextArea 
            placeholder="e.g. Tap here to explore 18K gold rings at 20% off exclusively on the app." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            maxLength={180}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading || fetching || pushTokens.length === 0}>
          {loading ? 'Sending...' : 'Send Broadcast'}
          <Send size={18} />
        </SubmitButton>
      </FormCard>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MetricIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 16px ${({ $color }) => `${$color}40`};
`;

const MetricInfo = styled.div``;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const FormCard = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.02);
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.02);
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 14px 24px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

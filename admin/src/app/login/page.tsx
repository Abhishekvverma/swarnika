'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔍 Check if user is admin
      const adminRef = doc(db, 'admin', user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        setError('You are not authorized as admin.');
        return;
      }

      // ✅ Admin verified
      router.push('/dashboard');

    } catch (err: any) {
      if (err.code === 'permission-denied') {
        setError('You do not have permission to access the admin portal.');
      } else {
        setError('Invalid email or password.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <BackgroundImage />
      <Overlay />
      
      <GlassContainer>
        <LoginBox animation="slideUp">
          <LogoArea>
            <LogoIcon>✨</LogoIcon>
            <Title>Luxe Gems</Title>
            <Subtitle>Admin Portal</Subtitle>
          </LogoArea>
          
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Address"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password"
                required
              />
            </FormGroup>
            
            <LoginButton type="submit" disabled={loading}>
              {loading ? (
                <Spinner />
              ) : (
                'Sign In securely'
              )}
            </LoginButton>
            <SupportText>Authorized personnel only.</SupportText>
          </Form>
        </LoginBox>
      </GlassContainer>
    </PageWrapper>
  );
}

// STYLED COMPONENTS

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000');
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, #000000 100%);
  z-index: 2;
`;

const GlassContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 20px;
`;

const LoginBox = styled.div<{ animation?: 'slideUp' }>`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const LogoArea = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const LogoIcon = styled.div`
  font-size: 32px;
  line-height: 1;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: rgba(248, 113, 113, 0.1);
  color: ${({ theme }) => theme.colors.danger};
  padding: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid rgba(248, 113, 113, 0.2);
  font-size: 14px;
  margin-bottom: 24px;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 15px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.white};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark} 0%, ${({ theme }) => theme.colors.primary} 100%);
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.35);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SupportText = styled.p`
  margin-top: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

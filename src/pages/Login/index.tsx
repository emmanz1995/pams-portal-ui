import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { LogInIcon } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'
// import { db, mockHash } from '../lib/db'
import {
  Card,
  Input,
  Label,
  FormGroup,
  Button,
  Title,
  ErrorText,
  Container,
} from '../../components/ui/Primitives.ts';
const LoginWrapper = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;
const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;
const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: ${({ theme }) => theme?.spacing?.md};
  font-size: ${({ theme }) => theme?.typography?.sizes?.sm};
`;
export const Login: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { login } = useAuth()
  // const navigate = useNavigate()
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setError('')
  //   if (!id || !password) {
  //     setError('Please enter both ID and password.')
  //     return
  //   }
  //   const user = db.login(id, mockHash(password))
  //   if (user) {
  //     login(user)
  //     if (user.role === 'tutor') {
  //       navigate('/tutor')
  //     } else {
  //       navigate('/student')
  //     }
  //   } else {
  //     setError('Invalid credentials. Please try again.')
  //   }
  // }
  return (
    <LoginWrapper>
      <LoginCard>
        <Title
          style={{
            textAlign: 'center',
          }}
        >
          Peer Evaluation
        </Title>
        <form>
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Bob"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="firstName">Surname</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Smith"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </FormGroup>

          {error && (
            <ErrorText
              style={{
                marginBottom: '16px',
              }}
            >
              {error}
            </ErrorText>
          )}

          <Button
            type="submit"
            style={{
              width: '100%',
            }}
          >
            <LogInIcon size={18} />
            Sign In
          </Button>
        </form>
        <StyledLink to="/sign-up">
          Don't have an account? Register here
        </StyledLink>
      </LoginCard>
    </LoginWrapper>
  );
};

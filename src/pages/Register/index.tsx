import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { UserPlusIcon } from 'lucide-react';
// import { db, mockHash } from '../lib/db'
import {
  Card,
  Input,
  Select,
  Label,
  FormGroup,
  Button,
  Title,
  ErrorText,
  Container,
} from '../../components/ui/Primitives.ts';
const RegisterWrapper = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;
const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 450px;
`;
const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: ${({ theme }) => theme?.spacing?.md};
  font-size: ${({ theme }) => theme?.typography?.sizes?.sm};
`;
export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    password: '',
    email: '',
    group: '1',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const validateForm = () => {
    if (!/^\d{9}$/.test(formData.id)) {
      return 'ID must be exactly 9 digits.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   const validationError = validateForm()
  //   if (validationError) {
  //     setError(validationError)
  //     return
  //   }
  //   const result = db.register({
  //     id: formData.id,
  //     passwordHash: mockHash(formData.password),
  //     email: formData.email,
  //     group: parseInt(formData.group, 10),
  //   })
  //   if (result.success) {
  //     navigate('/login')
  //   } else {
  //     setError(result.error || 'Registration failed.')
  //   }
  // }
  return (
    <RegisterWrapper>
      <RegisterCard>
        <Title
          style={{
            textAlign: 'center',
          }}
        >
          Student Registration
        </Title>
        <form>
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Bob"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="firstName">Surname</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Smith"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="group">Select Group (1-7)</Label>
            <Select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>
                  Group {num}
                </option>
              ))}
            </Select>
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
            <UserPlusIcon size={18} />
            Create Account
          </Button>
        </form>
        <StyledLink to="/login">Already have an account? Sign in</StyledLink>
      </RegisterCard>
    </RegisterWrapper>
  );
};

import styled, { css } from 'styled-components';
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;
export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
export const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
const inputStyles = css`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  transition: border-color 0.2s;
  background: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;
export const Input = styled.input`
  ${inputStyles}
`;
export const Select = styled.select`
  ${inputStyles}
`;
export const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 100px;
`;
export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
export const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;
export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
          }
        `;
      case 'secondary':
        return css`
          background: ${theme.colors.secondary};
          color: white;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.error};
          color: white;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background: ${theme.colors.background};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
export const Badge = styled.span<{
  status?: 'success' | 'warning' | 'default';
}>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};

  ${({ status = 'default', theme }) => {
    switch (status) {
      case 'success':
        return css`
          background: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
      default:
        return css`
          background: ${theme.colors.border};
          color: ${theme.colors.textLight};
        `;
    }
  }}
`;
export const Flex = styled.div<{
  gap?: string;
  align?: string;
  justify?: string;
  direction?: string;
}>`
  display: flex;
  gap: ${({ gap, theme }) => gap || theme.spacing.md};
  align-items: ${({ align }) => align || 'stretch'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  flex-direction: ${({ direction }) => direction || 'row'};
`;

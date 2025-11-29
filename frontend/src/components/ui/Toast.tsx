import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useToast } from '@/contexts/ToastContext';

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  pointer-events: none;

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
`;

const ToastItem = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  pointer-events: auto;
  cursor: pointer;
  animation: ${slideInRight} 0.3s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: rgba(16, 185, 129, 0.95);
          color: white;
          border-color: rgba(16, 185, 129, 0.3);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.95);
          color: white;
          border-color: rgba(239, 68, 68, 0.3);
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.95);
          color: white;
          border-color: rgba(245, 158, 11, 0.3);
        `;
      case 'info':
        return `
          background: rgba(59, 130, 246, 0.95);
          color: white;
          border-color: rgba(59, 130, 246, 0.3);
        `;
      default:
        return `
          background: rgba(107, 114, 128, 0.95);
          color: white;
          border-color: rgba(107, 114, 128, 0.3);
        `;
    }
  }}
  
  &:hover {
    transform: translateX(-4px);
    transition: transform 0.2s ease;
  }
`;

const ToastIcon = styled.span<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ToastMessage = styled.span`
  flex: 1;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  opacity: 0.8;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
  }
`;

const getToastIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return 'ℹ️';
  }
};

export const ToastNotifications: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          type={toast.type}
          onClick={() => removeToast(toast.id)}
        >
          <ToastIcon type={toast.type}>
            {getToastIcon(toast.type)}
          </ToastIcon>
          <ToastMessage>{toast.message}</ToastMessage>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
          >
            ×
          </CloseButton>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};
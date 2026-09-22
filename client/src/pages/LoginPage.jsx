import React from 'react';
import { UnifiedAuthCard } from '../components/auth/UnifiedAuthCard';
import { AuthLayout } from '../components/auth/AuthLayout';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <UnifiedAuthCard defaultMode="login" />
    </AuthLayout>
  );
};

export default LoginPage;

import React from 'react';
import { UnifiedAuthCard } from '../components/auth/UnifiedAuthCard';
import { AuthLayout } from '../components/auth/AuthLayout';

export const SignupPage = () => {
  return (
    <AuthLayout>
      <UnifiedAuthCard defaultMode="signup" />
    </AuthLayout>
  );
};

export default SignupPage;

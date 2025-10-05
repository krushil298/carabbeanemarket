import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const { signup, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <AuthForm type="signup" onSubmit={signup} />
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
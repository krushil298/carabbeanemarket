import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <AuthForm type="login" onSubmit={({ email, password }) => login(email, password)} />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
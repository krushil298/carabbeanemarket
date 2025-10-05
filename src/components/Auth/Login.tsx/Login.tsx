import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <AuthForm type="login" onSubmit={(values) => login(values.email, values.password)} />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
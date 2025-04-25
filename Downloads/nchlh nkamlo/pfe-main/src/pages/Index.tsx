
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  return <Navigate to="/project" replace />;
};

export default Index;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/user/Dashboad';
import AdminDashboard from './components/admin/AdminDashboard';
import ResignationForm from './components/user/ResignationForm';
import ExitQuestionnaire from './components/user/ExitQuestionnaire';
import ResignationList from './components/admin/ResignationList';
import ExitResponses from './components/admin/ExitResponses';
import Thanks from './components/user/Thanks';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="resign" element={<ResignationForm />} />
          <Route path="exit-interview" element={<ExitQuestionnaire />} />
          <Route path="thanks" element={<Thanks />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="resignations" element={<ResignationList />} />
          <Route path="exit-responses" element={<ExitResponses />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
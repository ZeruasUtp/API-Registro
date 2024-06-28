import React from 'react';
import { Redirect } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Navbar from '../components/Navbar';

const Dashboard = ({ role, onLogout }) => {

  if (!role) {
    return <Redirect to="/login" />;
  }

  const user = {

  };

  return (
    <div>
      <Navbar user={user} />
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', marginTop: '70px' }}>
        <Sidebar onLogout={onLogout} role={role} />
        <MainContent role={role} user={user} />
      </div>
    </div>
  );
};

export default Dashboard;

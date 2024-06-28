// src/components/MainContent.js
import React from 'react';

const MainContent = ({ role, user }) => {
  return (
    <div style={{ flex: 1, padding: '70px 20px 20px 20px' }}>
      <h1>Welcome, {role}</h1>
      <p>Main Content Goes Here</p>
    </div>
  );
};

export default MainContent;

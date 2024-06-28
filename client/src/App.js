import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error('Error decoding token:', error);
        setRole(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    setRole(decodedToken.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/login">
            {role ? <Redirect to="/dashboard" /> : <Login onLogin={handleLogin} />}
          </Route>
          <Route path="/dashboard">
            {role ? <Dashboard role={role} onLogout={handleLogout} /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token } = response.data;
      onLogin(token);
      setNotification({ message: 'Datos correctos', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Datos incorrectos', type: 'error' });
    }
  };

  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="login-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="background-image"></div>
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <span className="icon"><i className="fas fa-envelope"></i></span>
          </div>
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span className="icon"><i className="fas fa-lock"></i></span>
          </div>
          <button type="submit" className="login-button">Acceder</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

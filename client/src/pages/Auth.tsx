import React from 'react';
import { useParams } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = () => {
  const user = false; // Set to false to allow login/register or implement actual auth check
  const { pathname } = useParams();

  return (
    <div>
      {!user && pathname === 'sign-in' && <Login />}
      {!user && pathname === 'sign-up' && <Register />}
    </div>
  );
};

export default Auth;

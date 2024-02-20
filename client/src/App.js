import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from './router/routes';
import PermissionToRender from './components/Permission/PermissionToRender';
import { logout } from './features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { IconButton } from '@mui/material';
import { GitHub } from '@mui/icons-material';

import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const logOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <>
      {
        user && (
          <header className='shadow-xl sticky'>
            <nav className='flex justify-between items-center'>
              <h1 className='text-2xl font-bold m-2 p-2 cursor-pointer' onClick={
                () => { window.location.href = '/' }}>Authentication & Roles and Permissions</h1>
              <ul className='flex m-2 p-2 gap-2'>
                <li className='bg-blue-400 text-white p-2 rounded-md' >
                  <a href="/">Users</a>
                </li>
                <li className='bg-blue-400 text-white p-2 rounded-md' >
                  <a href="/edit-user-roles">Edit Roles</a>
                </li>
                <li className='cursor-pointer bg-black text-white p-2 rounded-md' onClick={logOut}>
                  <p >Log Out</p>
                </li>
              </ul>
            </nav>
          </header>
        )
      }
      <Router>
        <Routes>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  user ? (
                    <PermissionToRender
                      instanceCanView={route.instanceCanView}
                      roleCanView={route.roleCanView}
                      permissionsCanView={route.permissionsCanView}
                    >
                      {route.element}
                    </PermissionToRender>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            );
          })}
          {/* Giriş yapmamış kullanıcılar için giriş sayfasına yönlendir */}
          {!user && <Route path="/login" element={<Login />} />}
          {/* Giriş yapmamış kullanıcılar için kayıt sayfasına yönlendir */}
          {!user && <Route path="/register" element={<Register />} />}
        </Routes>
      </Router>
      <footer className=' h-full flex justify-evenly items-end p-2 m-2'>
        <div className='flex justify-center items-center'>
          <div className='flex justify-center items-center'>
            <a href='https://ismetomerkoyuncu.tech' target='_blank'>
              ismetomerkoyuncu
            </a>
          </div>
          <div className='flex justify-center items-center'>
            <IconButton
              href='https://github.com/iomerkoyuncu/auth'
              target='_blank'>
              <GitHub />
            </IconButton>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
import React, { useEffect, useState } from 'react';

import { Route, Routes } from 'react-router-dom';
import './RouterView.scss';
import { loginPageSubject } from '../../events/LoginPageEvent';
import ProtectedRouteApp from '../ProtectedRouteApp';
import LandingPage from '../Page/LandingPage';
import UnauthorizedPage from '../Page/UnauthorizedPage';

interface Props {
}

const RouterView = (props: Props) => {
  const [loginPage, setLoginPage] = useState(true);

  useEffect(() => {
    loginPageSubject.subscribe((message) => {
      setLoginPage(message.state);
    });
  }, []);

  return (
    <div
      className={`router-view ${loginPage ? 'on-login-page' : 'not-on-login-page'}`}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={LandingPage} />
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={LandingPage} />
          }
        />
        <Route
          path="/unauthorized"
          element={
            <ProtectedRouteApp
              middleware={['isAuthenticated']} component={UnauthorizedPage} />}
        />
      </Routes>
    </div>
  );
};

export default RouterView;

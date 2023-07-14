import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import MasterLayout from './layouts/admin/MasterLayout';


import Login from './components/frontend/auth/Login';
import Register from './components/frontend/auth/Register';
import AdminPrivateRoute from './AdminPrivateRoutes';


import Page403 from './components/errors/Page403';
import Page404 from './components/errors/Page404';
import axios from 'axios';
import PublicRoute from './PublicRoutes';

axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <AdminPrivateRoute path="/admin" name="Admin"></AdminPrivateRoute>

          <PublicRoute path="/" name="Home"></PublicRoute>

          <Route path="/403" component={Page403}></Route>
          <Route path="/404" component={Page404}></Route>

          <Route path="/login">
            {localStorage.getItem('auth_token') ? <Redirect to='/' /> : <Login />}
          </Route>

          <Route path="/register">
            {localStorage.getItem('auth_token') ? <Redirect to='/' /> : <Register />}
          </Route>


        </Switch>
      </Router>
    </div>
  );
}

export default App;
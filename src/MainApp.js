import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthContext } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './Navbar';
import HomePage from './components/HomePage';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';
import LoginForm from './components/LoginForm';

const MainApp = () => {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      {token ? <Navbar /> : ''}
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/post/:postId' component={PostPage} />
        <Route exact path='/login' component={LoginForm} />
        <PrivateRoute exact path='/newPost'>
          <NewPost />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default MainApp;

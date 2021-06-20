import React, { useContext, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch, useHistory } from "react-router-dom";
import { AuthContext, AuthActionsContext } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './Navbar';
import NotFoundPage from './NotFoundPage';
import HomePage from './components/HomePage';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';
import LoginForm from './components/LoginForm';

const MainApp = () => {
  // Settings
  const history = useHistory();

  // Authorization
  const authActions = useContext(AuthActionsContext);
  const { token } = useContext(AuthContext);

  // Check if there is a refresh token in the cookies
  const checkRefreshToken = async () => {
    try {
      if (!token) {
        const results = await authActions.renewToken();
        if (results) {
          history.push('/');
        }
      }
    } catch (error) {
      console.log('No refresh token stored, all good, you don\'t need to do anything about it');
    }
  }

  useEffect(() => {
    checkRefreshToken();
  }, [])

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/post/:postId' component={PostPage} />
        <Route exact path='/login' component={LoginForm} />
        <PrivateRoute exact path='/newPost'>
          <NewPost />
        </PrivateRoute>
        <Route render={() => <NotFoundPage />} />
      </Switch>
    </Router>
  )
}

export default MainApp;

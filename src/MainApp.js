import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import HomePage from './components/HomePage';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';

const MainApp = () => {


  return (
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/newPost' component={NewPost} />
        <Route exact path='/post/:postId' component={PostPage} />
      </Switch>
    </Router>
  )
}

export default MainApp;

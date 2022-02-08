import { useContext, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch, useHistory } from "react-router-dom";
import { AuthContext, AuthActionsContext } from '../Contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import NotFound from '../Components/NotFound';
import Homepage from '../Components/Homepage';
import NewPost from '../Components/NewPost';
import PostDetails from '../Components/PostDetails';
import Login from '../Components/Login';
import DeletePost from '../Components/DeletePost';
import Paths from "./Paths";

const AppRouter = () => {
  // Settings
  const history = useHistory();

  // Authorization
  const authActions = useContext(AuthActionsContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    // Check if there is a refresh token in the cookies
    if (!token && isMounted) {
      authActions.renewToken().then((results) => {
        if (results) {
          history.push('/');
        }
      }).catch((e) => {
        return true;
        // console.log('No refresh token stored, all good, you don\'t need to do anything about it');
      })
    }

    return () => isMounted = false;
  }, [token])

  return (
    <Router>
      <Switch>
        <Route exact path={Paths.home} component={Homepage} />
        <Route exact path={Paths.postDetails} component={PostDetails} />
        <Route exact path={Paths.loginRegister} component={Login} />
        <Route exact path={Paths.deletePostComment} component={DeletePost} />
        <PrivateRoute exact path={Paths.newPost}>
          <NewPost />
        </PrivateRoute>
        <Route render={() => <NotFound />} />
      </Switch>
    </Router>
  )
};

export default AppRouter;

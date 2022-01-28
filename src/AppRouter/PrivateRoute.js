import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from '../Contexts/AuthContext';
import Paths from './Paths';

function PrivateRoute({ children, ...rest }) {
    const { token } = useContext(AuthContext);

    return (
        <Route {...rest}
            render={({ location }) => {
                return token ? children : <Redirect to={{ pathname: Paths.loginRegister, state: { from: location } }} />
            }}
        />
    )
}

export default PrivateRoute;

import React, { useContext } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { AuthContext } from './contexts/AuthContext';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const history = useHistory();

    const handleOnClick = (evt) => {
        evt.preventDefault();
        history.push(`/${evt.target.name}`);
    }

    return (
        <div>
            <h1>Hi {user ? user.username : ''}!</h1>
            <button onClick={handleOnClick} name="">Home</button>
            <button onClick={handleOnClick} name="login">Login</button>
            <button onClick={handleOnClick} name="newPost">New Post</button>
            <button onClick={handleOnClick} name="accountSettings">Acount Settings</button>
        </div>
    );
}

export default withRouter(Navbar);

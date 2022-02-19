import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext, AuthActionsContext } from '../../Contexts/AuthContext';
import './navbar.scss';

const Navbar = () => {
    // Settings
    const history = useHistory();
    
    // Authorization
    const authActions = useContext(AuthActionsContext);
    const { token } = useContext(AuthContext);

    const handleOnClick = (evt) => {
        evt.preventDefault();
        history.push(`/${evt.target.name}`);
    }

    const handleLogout = async (evt) => {
        evt.preventDefault();
        await authActions.logout();
        history.push('/');
    }

    return (
        <div>
            <nav className='navbar fixed-top navbar-expand-sm navbar-light'>
                <div className='container-fluid'>
                    <a className='navbar-brand mx-5' onClick={handleOnClick} name='' href='/'>Spurr</a>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <div className='me-auto'></div>
                        <div className='d-flex'>
                            <div className='navbar-nav'>
                                <div className='nav-item dropdown mx-2'>
                                    <div className='nav-link dropdown-toggle' id='navbarDropdown' role='button' data-bs-toggle='dropdown' aria-expanded='false'>Manage</div>
                                    <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                        <li><a className='dropdown-item' href='/'>Manage a Post</a></li>
                                        <li><a className='dropdown-item' href='/'>Manage a Comment</a></li>
                                    </ul>
                                </div>
                                <a className='nav-link mx-2' href='/'>Code Contribution</a>
                                {!token ? <a className='nav-link mx-2' onClick={handleOnClick} name='login' href='/'>Login/Register</a> : ''}
                                {token ? <a className='nav-link mx-2' onClick={handleLogout} name='logout' href='/'>Logout</a> : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;

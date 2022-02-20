import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext, AuthActionsContext } from '../../Contexts/AuthContext';
import Paths from '../../AppRouter/Paths';
import './navbar.scss';

const Navbar = () => {
    // Settings
    const history = useHistory();

    // Authorization
    const authActions = useContext(AuthActionsContext);
    const { token } = useContext(AuthContext);

    const handleOnClick = (evt, navigateTo) => {
        evt.preventDefault();
        history.push(navigateTo);
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
                    <a className='navbar-brand mx-5' onClick={(evt) => handleOnClick(evt, Paths.home)} href='/'>
                        <img src="../spurr-logo-white.png" alt="spurr" height="26" className="d-inline-block align-text-top" />
                    </a>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <div className='me-auto'></div>
                        <div className='d-flex'>
                            <div className='navbar-nav'>
                                <a className='nav-link mx-2' onClick={(evt) => handleOnClick(evt, Paths.managePost)} href={Paths.managePost}>Manage Post</a>
                                <a className='nav-link mx-2' href='https://github.com/aalzubidy/csinterviewquestions-frontend' target='_blank' rel='noreferrer'>Source Code</a>
                                {!token ? <a className='nav-link mx-2' onClick={(evt) => handleOnClick(evt, Paths.loginRegister)} href='/'>Login/Register</a> : ''}
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

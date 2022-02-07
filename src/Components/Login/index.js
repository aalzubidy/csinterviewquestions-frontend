import React, { useState, useEffect, useContext, useRef } from 'react';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import { Tooltip, Button } from '@mui/material';
import { AuthContext, AuthActionsContext } from '../../Contexts/AuthContext';
import { AlertsContext } from '../../Contexts/AlertsContext';
import './login.scss';

const Login = () => {
  // Settings
  let isMounted = useRef(false);
  const { alertMsg } = useContext(AlertsContext);
  const { token } = useContext(AuthContext);
  const authActions = useContext(AuthActionsContext);
  const history = useHistory();
  const { state } = useLocation();
  const genericError = 'Login - Uknown error, check console logs for details';

  // Handle email, username, and pin
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');

  // Handle stage
  const [newUser, setNewUser] = useState(false);
  const [pinSent, setPinSent] = useState(false);

  // Handle validation
  const [disableSendPassword, setDisableSendPassword] = useState(true);
  const [disableLogin, setDisableLogin] = useState(true);
  const emailRegexPattern = new RegExp(/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const [redirectReady, setRedirectReday] = useState('initialized');

  // Check if email address is correct, and if username is populated for registeration
  const updateSendPasswordButton = () => {
    if (!newUser && email && email.match(emailRegexPattern)) setDisableSendPassword(false);
    else if (newUser && email && username && email.match(emailRegexPattern)) setDisableSendPassword(false);
    else setDisableSendPassword(true);
  }

  // Check if email and pin are populated
  const updateLoginButton = () => {
    if (email && pin && email.match(emailRegexPattern)) setDisableLogin(false);
    else setDisableLogin(true);
  }

  // Generate pin or register new user and generate pin
  const generatePin = async (evt) => {
    evt.preventDefault();
    alertMsg('info', 'Please wait', 'Sending a pin to your email right now.');
    try {
      let results = '';
      results = newUser ? await authActions.generateUserPin(email, username) : await authActions.generateUserPin(email);
      if (results) {
        alertMsg('success', 'Pin sent', 'A pin was sent to your email address, please login with your pin.');
        setPinSent(true);
      }
    } catch (error) {
      alertMsg('error', 'could not generate pin or register user', error.message || genericError, error);
    }
  }

  // Login with email and pin
  const loginPin = async (evt) => {
    evt.preventDefault();
    try {
      let results = '';
      results = await authActions.login(email, pin);
      if (results) {
        console.log(results);
        alertMsg('success', 'Login successfully', 'Login is successful. Browser will redirect automatically.');
        setRedirectReday(true);
      }
    } catch (error) {
      alertMsg('error', 'could not login with email and pin', error.message || genericError, error);
      setRedirectReday(false);
    }
  }

  // Check if there is a stored refresh token
  const checkRefreshToken = async () => {
    try {
      if (!token) {
        const results = await authActions.renewToken();
        if (results) {
          state ? history.push(state.from) : history.push('/');
        }
      } else {
        setRedirectReday(false);
      }
    } catch (error) {
      setRedirectReday(false);
    }
  }

  useEffect(() => {
    isMounted = true;

    updateSendPasswordButton();
    updateLoginButton();
    checkRefreshToken();

    return () => isMounted = false;
  }, [email, username, pin, newUser, redirectReady, token]);

  if (redirectReady === true && isMounted) {
    return <Redirect to={state?.from || '/'} />
    // state ? history.push(state.from) : history.push('/home');
  }

  return (
    <div className='container-fluid loginContainer'>
      <div className='loginBox'>
        <div className='form-check form-switch registerSwitchDiv formItem'>
          <Tooltip title='Is this your first time registering? if yes, then check this switch.'>
            <div>
              <label className='form-check-label' htmlFor='newUser'>Register New User</label>
              <input className='form-check-input' type='checkbox' id='newUser' value={newUser} checked={newUser} onChange={() => setNewUser(!newUser)} />
            </div>
          </Tooltip>
        </div>

        <div className='formItem'>
          <input type='email' className='form-control' placeholder='Enter email' name='email' value={email} onChange={(evt) => setEmail(evt.target.value)} required />
        </div>

        {newUser ? <Tooltip title='Pick a display name to use for comments'>
          <div className='formItem'>
            <input type='email' className='form-control' placeholder='Enter username' name='username' value={username} onChange={(evt) => setUsername(evt.target.value)} required />
          </div>
        </Tooltip> : ''}


        {pinSent ? <Tooltip title='Login pin was sent to your email address'>
          <div className='formItem'><input type='password' className='form-control' placeholder='Enter login pin' name='pin' value={pin} onChange={(evt) => setPin(evt.target.value)} required />
          </div>
        </Tooltip> : ''}

        <div className='formItem'>
          {!pinSent ? <Button disabled={disableSendPassword} onClick={generatePin} variant='outlined'>Next</Button>
            : <Button disabled={disableLogin} onClick={loginPin} variant='outlined'>Login</Button>}
        </div>

      </div>
    </div>
  )
}

export default Login;

import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useLocation, useHistory } from "react-router-dom";
import { AuthContext, AuthActionsContext } from '../Contexts/AuthContext';

const LoginForm = (props) => {
  const authActions = useContext(AuthActionsContext);
  const { token } = useContext(AuthContext);

  const { state } = useLocation();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');

  const [newUser, setNewUser] = useState(false);
  const [pinSent, setPinSent] = useState(false);

  const [disableSendPassword, setDisableSendPassword] = useState(true);
  const [disableLogin, setDisableLogin] = useState(true);

  const [loginMessage, setLoginMessage] = useState('');
  const [redirectReady, setRedirectReday] = useState('initialized');

  const emailRegexPattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const updateSendPasswordButton = () => {
    if (!newUser && email && email.match(emailRegexPattern)) setDisableSendPassword(false);
    else if (newUser && email && username && email.match(emailRegexPattern)) setDisableSendPassword(false);
    else setDisableSendPassword(true);
  }

  const updateLoginButton = () => {
    if (email && pin && email.match(emailRegexPattern)) setDisableLogin(false);
    else setDisableLogin(true);
  }

  const generatePin = async (evt) => {
    evt.preventDefault();
    try {
      let results = '';
      results = newUser ? await authActions.generateUserPin(email, username) : await authActions.generateUserPin(email);
      if (results) {
        console.log(results);
        setLoginMessage('A pin was sent to your email. Please login with your pin.');
        setPinSent(true);
      }
    } catch (error) {
      setLoginMessage(`Could not login :( error details: ${error}`);
    }
  }

  const loginPin = async (evt) => {
    evt.preventDefault();
    try {
      let results = '';
      results = await authActions.login(email, pin);
      if (results) {
        console.log(results);
        setLoginMessage('Login is successful. Browser will redirect automatically.');
        setRedirectReday(true);
      }
    } catch (error) {
      setLoginMessage(`Could not login :( error details: ${error}`);
      setRedirectReday(false);
    }
  }

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
    updateSendPasswordButton();
    updateLoginButton();
    checkRefreshToken();
  }, [email, username, pin, newUser, token]);

  if (redirectReady === true) {
    return <Redirect to={state?.from || '/'} />
    // state ? history.push(state.from) : history.push('/home');
  }

  return (
    <div>
      {!pinSent ? <div>
        <input name="newUser" type="checkbox" checked={newUser} onChange={() => setNewUser(!newUser)} />
        <label htmlFor='newUser'>First time registering to post or comment</label>
      </div> : ''}
      <br />

      <input type="email" placeholder='Enter email' name='email' value={email} onChange={(evt) => setEmail(evt.target.value)} required />
      <br />

      {newUser ? <input placeholder='Enter a display name for comments' name='username' value={username} onChange={(evt) => setUsername(evt.target.value)} /> : ''}
      <br />

      {pinSent ? <input type="password" placeholder='Enter your login pin' name='pin' value={pin} onChange={(evt) => setPin(evt.target.value)} required /> : ''}
      <br />

      {!pinSent ? <button disabled={disableSendPassword} onClick={generatePin}>Get 1 Time Password</button> : ''}

      {pinSent ? <button disabled={disableLogin} onClick={loginPin}>Login</button> : ''}

      {loginMessage ? <h1>{loginMessage}</h1> : ''}
    </div>
  )
}

export default LoginForm;

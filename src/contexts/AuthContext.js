import React, { createContext, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthActionsContext = createContext();

export function AuthProvider(props) {
    // Dynamic
    const [token, setToken] = useState(null);
    const [renewTokenInProgress, setRenewTokenInProgress] = useState(false);
    const [user, setUser] = useState(null);

    // Static
    const logoutEventName = 'csinterviewquestions-logout';

    // Urls
    const baseUrl = 'http://localhost:3030';
    const renewTokenUrl = '/renewTokenByCookie';
    const loginUrl = '/login';
    const logoutUrl = '/logout';
    const generateUserPinUrl = '/generateUserPin';
    const getUserUrl = '/getTokenUser';

    // Timeout configurations
    const tokenTimeOutMS = 9 * 60 * 1000;
    let tokenTimeOutId = null;

    // Cancel renewing token timeout
    const cancelRenewTokenSchedule = () => {
        if (tokenTimeOutId) {
            window.clearTimeout(tokenTimeOutId);
        }
    };

    // Get in memory token
    const getToken = () => {
        return token;
    };

    // Set in memory token
    const setAccessToken = (accessToken) => {
        getUser(accessToken);
        setToken(accessToken);
        scheduleRenewToken();
    };

    // Delete token for logout
    const clearToken = () => {
        setToken(null);
        setUser(null);
        cancelRenewTokenSchedule();
        window.localStorage.setItem(logoutEventName, Date.now());
    };

    //  Renew token by cookie
    const renewToken = async () => {
        if (!renewTokenInProgress) {
            try {
                setRenewTokenInProgress(true);
                const renewTokenResponse = await axios.post(baseUrl + renewTokenUrl, {}, {
                    withCredentials: true
                });

                if (renewTokenResponse && renewTokenResponse.data && renewTokenResponse.data['data']) {
                    await setAccessToken(renewTokenResponse.data['data']['accessToken']);
                    setRenewTokenInProgress(false);
                    return renewTokenResponse.data['data']['accessToken'];
                } else {
                    setRenewTokenInProgress(false);
                    clearToken();
                    return false;
                }
            } catch (error) {
                setRenewTokenInProgress(false);
                clearToken();
                throw error;
            }
        }
    };

    // Call renewToken automatically before token expires
    const scheduleRenewToken = () => {
        tokenTimeOutId = setTimeout(() => {
            renewToken()
        }, tokenTimeOutMS);
    }

    // Disconnect all session
    window.addEventListener('storage', (event) => {
        if (event.key === logoutEventName) {
            clearToken();
        }
    });

    // Login and set access token
    const login = async (email, pin) => {
        try {
            const ip = '192.168.0.1';
            const loginResponse = await axios.post(baseUrl + loginUrl, {
                email,
                pin,
                ip
            }, {
                withCredentials: true
            }
            );

            if (loginResponse && loginResponse.data && loginResponse.data['data']) {
                setAccessToken(loginResponse.data['data']['accessToken']);
                return (loginResponse.data['data']['accessToken']);
            } else {
                clearToken();
                throw new Error('could not login');
            }
        } catch (error) {
            clearToken();
            throw error;
        }
    };

    // Logout user from backend and front end
    const logout = async () => {
        try {
            await axios.delete(baseUrl + logoutUrl, {
                headers: {
                    token
                }
            });
            clearToken();
            return ('Logged out successful');
        } catch (error) {
            clearToken();
            throw new Error('Could not logout from backend');
        }
    };

    // Get user information
    const getUser = async (accessToken) => {
        try {
            const userResponse = await axios.get(baseUrl + getUserUrl, { headers: { token: accessToken } });
            if (userResponse.data) {
                const newUser = userResponse.data.data;
                if (user && newUser && newUser.id === user.id && newUser.name === user.name && newUser.email === user.email && newUser.organization === user.organization) {
                    return user;
                } else {
                    setUser(newUser);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    };

    // Generate a user pin and return backend results
    const generateUserPin = async (email, username = null) => {
        try {
            const ip = '192.168.0.1';
            const response = await axios({
                method: 'post',
                url: baseUrl + generateUserPinUrl,
                data: {
                    email,
                    username,
                    ip
                }
            });

            if (response && response.data && response.data['data']) {
                return (response.data);
            } else {
                clearToken();
                throw new Error('could not get one time password');
            }
        } catch (error) {
            clearToken();
            throw `Could not generate user pin ${error}`;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user }}>
            <AuthActionsContext.Provider value={{ getToken, login, logout, generateUserPin, renewToken }}>
                {props.children}
            </AuthActionsContext.Provider>
        </AuthContext.Provider>
    );
}

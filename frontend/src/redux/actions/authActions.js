import { LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR } from '../types';
import axios from 'axios';
import API from '../../api';

export const loginUser = (userData, loginSuccess, loginFailure) => ( async dispatch => { 
    dispatch({
        type: LOGIN_START
    });
    await API.post('/login', userData)
        .then((response) => {
            const { token } = response.data
            if (token) {
                setAuthHeader(token);
                dispatch({ type: LOGIN_SUCCESS });
                loginSuccess();
            } else {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: {}
                });
                loginFailure();
            }
        })
        .catch((err) => {
            console.log(err.response);
            const msg = err.response.data.error
            dispatch({
                type: LOGIN_ERROR,
                payload: {
                    msg
                }
            });
            loginFailure();
        })
});

const setAuthHeader = (token) => {
    const idToken = `Bearer ${token}`;
    localStorage.setItem('idToken', idToken);
    axios.defaults.headers.common['Authorization'] = idToken;
  };

export const logoutUser = () => {
    localStorage.removeItem('idToken');
    delete axios.defaults.headers.common['Authorization'];
  };

export const isLoggedIn = () => {
    const token = localStorage.getItem('idToken');
    return !!token;
}
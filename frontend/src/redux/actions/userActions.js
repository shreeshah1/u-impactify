import API from '../../api';
import { USER_COURSES, USER_ERROR, USER_TYPE, SET_USER } from '../types';


export const userCourses = () => (async (dispatch) => {
    await API.get('/userCourses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      })
        .then((response) => {
            dispatch({ 
                type: USER_COURSES,
                payload: response.data
             });
        })
        .catch((err) => {
            console.log(err);
            let msg = '';
            if(err.response){
                msg = err.response.data.error;
            }
            dispatch({
                type: USER_ERROR,
                payload: {
                    msg
                }
            });
        })
});

export const userTypeDetails = () => (async (dispatch) => {
    const email = localStorage.getItem('email');
    const userData = {
        email: email
    }
    await API.post('/userType', userData)
        .then((response) => {
            const { type } = response.data;
            dispatch({ 
                type: USER_TYPE,
                payload: {
                    type
                }
             });
        })
        .catch((err) => {
            console.log(err);
            let msg = '';
            if(err.response){
                msg = err.response.data.error;
            }
            dispatch({
                type: USER_ERROR,
                payload: {
                    msg
                }
            });
        })
});

export const getAuthenticatedUserData = () => (async (dispatch) => {
    await API.get('/getAuthenticatedUser', { headers: {
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
    }})
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => {
            console.error(err);
            dispatch({
                type: USER_ERROR,
                payload: { msg: err.response.data }
            });
        })
 })
 

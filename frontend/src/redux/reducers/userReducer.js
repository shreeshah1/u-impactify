import { USER_COURSE_IDS, USER_ERROR, USER_TYPE, SET_USER } from '../types';

const initialState = {
    userType: null,
    userCourseIds: [],
    errors: null,
    userData: null, 
}

export default function(state = initialState, action){
    switch(action.type){
        case USER_COURSE_IDS:
            state.userCourseIds = action.payload.courses;
            return state
        case USER_TYPE:
            return {
                ...state,
                userType: action.payload.type
            }
        case USER_ERROR:
            state.errors = action.payload.msg;
            return state
        case SET_USER:
            return {
                ...state,
                userData: action.payload,
                errors: {}
            }
        default:
            return state
    }
}
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import coursesReducer from './reducers/coursesReducer';
import userReducer from './reducers/userReducer';
import postsReducer from './reducers/postsReducer';

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
    auth: authReducer,
    courses: coursesReducer,
    user: userReducer,
    posts: postsReducer
});

const store = createStore(
    reducers, 
    initialState, 
    compose(
        applyMiddleware(...middleware)
    )
);

export default store;
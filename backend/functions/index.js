const functions = require('firebase-functions');

const app = require('express')();

const { signup, login, userCourses, userType, getAuthenticatedUser } = require ('./handlers/users'); 
const { getCourse, getAllCourses } = require ('./handlers/courses');
const fbAuth = require('./util/fbAuth');

const cors = require('cors');
app.use(cors());

const config = require("./util/config");
const firebase = require("firebase");
firebase.initializeApp(config);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/userCourses', userCourses);
app.post('/getCourse', getCourse)
app.post('/userType', userType)
app.get('/getAllCourses', getAllCourses);
app.get('/getAuthenticatedUser', fbAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
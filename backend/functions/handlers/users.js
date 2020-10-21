const { admin, db } = require("../util/admin");
const { validateSignupData, validateLoginData } = require('../util/validators');
const { userTypes } = require('../util/constants');
const { user } = require("firebase-functions/lib/providers/auth");

// Sign up 
exports.signup = (req, res) => {
    const newUser = {
        type: req.body.type, 
        org: req.body.org,
        first: req.body.first,
        last: req.body.last, 
        email: req.body.email, 
        password: req.body.password, 
        confirmPassword: req.body.confirmPassword
    }

    const { valid, errors } = validateSignupData(newUser); 
    if(!valid) return res.status(400).json(errors); 

    let token, uid; 
    db.doc(`/users/userTypes/${newUser.type}/${newUser.email}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ email: 'This email is already taken' });
            }
            else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password); 
            }
        })
        .then(data => {
            uid = data.user.uid; 
            return data.user.getIdToken(); 
        })
        .then(idToken => {
            token = idToken; 
            var userCredentials; 
            if (newUser.type === userTypes.SOCIAL_INITIATIVE) {
                userCredentials = {
                    type: newUser.type,
                    org: newUser.org,
                    email: newUser.email,
                    uid
                };
            }
            else {
                userCredentials = {
                    type: newUser.type,
                    email: newUser.email,
                    first: newUser.first, 
                    last: newUser.last,
                    uid
                };
            }
            return db.doc(`/users/userTypes/${newUser.type}/${newUser.email}`).set(userCredentials); 
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch(err => {
            console.error(err); 
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email is already in use '});
            }
            else {
                return res.status(500).json({ error: err.code }); 
            }
        })
}

// Login user 
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors); 

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/wrong-password'){
                return res.status(403).json({ error: 'Wrong credentials. Please try again.'})
            }
            else { 
                return res.status(500).json({ error: err.code });
            }
            
        });
};

exports.userCourses = (req, res) => {
    const { email, usertype } = req.body;
    if( usertype == userTypes.SOCIAL_INITIATIVE) {
        return res.status(500).json({error: "No courses"});
    }
    const userData = [];
    db.collection(`/users/userTypes/${usertype}/${email}/courses`).get()
        .then(querySnapshot => {
            if(querySnapshot.empty){
                return res.status(404).json({error: "invalid request"});
            }
            querySnapshot.docs.forEach((doc) => {
                if(doc.exists){
                    userData.push(doc.id);
                }
            })
            return res.status(201).json({courses: userData});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err.code});
        });
};

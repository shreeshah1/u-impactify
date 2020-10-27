const { admin, db } = require("../util/admin");
const { validateSignupData, validateLoginData } = require('../util/validators');
const { userTypes } = require('../util/constants');
const { user } = require("firebase-functions/lib/providers/auth");
const firebase = require("firebase");
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
    db.doc(`/users/${newUser.email}`).get()
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
            return db.doc(`/users/${newUser.email}`).set(userCredentials); 
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
            return res.status(201).json({token});   
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
    if( usertype === userTypes.SOCIAL_INITIATIVE) {
        return res.status(500).json({error: "No Courses"});
    }
    const userData = [];
    db.collection(`/users/${email}/courses`).get()
        .then(querySnapshot => {
            if(querySnapshot.empty){
                return res.status(404).json({error: "No Courses"});
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

exports.userType = (req, res) => {
    const { email } = req.body;
    db.doc(`/users/${email}`).get()
        .then(doc => {
            if(doc.exists){
                const { type } = doc.data();
                return res.status(201).json({type});           
            } else {
                return res.status(404).json({error: "No such email"});
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err.code});
        });
}

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.email}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
            }
            return res.status(200).json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
 }
 

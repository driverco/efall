const functions = require("firebase-functions");
const admin = require("firebase-admin");
let serviceAccount = require("./cert/efall-61616-40cfb6649853.json");
const express = require("express");
const app = express();

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const config = {
  apiKey: "AIzaSyDIeoDwqk7sLJvsNsabxEmsyt2R6UM3vgg",
  authDomain: "efall-61616.firebaseapp.com",
  databaseURL: "https://efall-61616.firebaseio.com",
  projectId: "efall-61616",
  storageBucket: "efall-61616.appspot.com",
  messagingSenderId: "888734526598",
  appId: "1:888734526598:web:66b78eaece3dafe0e4f507",
  measurementId: "G-1QRTR4318F",
};

const firebase = require("firebase");
firebase.initializeApp(config);

const db = admin.firestore();

app.get("/screams", (request, response) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          ...doc.data(),
        });
      });
      return response.json(screams);
    })
    .catch((err) => {
      console.error(err);
      return response.json(err);
    });
});

app.post("/scream", (request, response) => {
  const newScream = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: new Date().toISOString(),
  };
  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      response.json({ message: `document ${doc.id} created sucessfully` });
    })
    .catch((err) => {
      response.status(500).json({ error: "something went wrong" + err });
    });
});

const isEmpty = (string) =>{
    if (string.trim() ==='') return true;
    else return false;
}

const isEmail = (email) =>{
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
}

app.post("/signup", (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle,
  };
  let errors = {};
  if(isEmpty(newUser.email))errors.email = 'Must not be empty'
  else if(!isEmail(newUser.email))errors.email = 'Must be a valid email address'

  if(isEmpty(newUser.password))errors.password = 'Must not be empty'

  if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match'
  if(isEmpty(newUser.handle))errors.handle = 'Must not be empty'

  if(Object.keys(errors).length> 0) return response.status(400).json(errors);

  let token, userId; 
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ handle: `this handle is already taken` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    }).then(data=>{
        userId = data.user.uid;
        return  data.user.getIdToken();
    }).then(idToken=>{
        token = idToken;
        const userCredentials= {
            handle:newUser.handle,
            email:newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        
    }).then(() =>{
        return response.status(201).json({token});
    })
    .catch(err=>{
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return response.status(400).json({ email: "Email is already in use"});
        }else{
            return response.status(500).json({ error: err.code });
        }
    });

});

app.post("/login", (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    };
    let errors = {};

    if(isEmpty(user.email))errors.email = 'Must not be empty'
    if(isEmpty(user.password))errors.password = 'Must not be empty'
  
    if(Object.keys(errors).length> 0) return response.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(data =>{
        return data.user.getIdToken();
    }).then(token=>{
        return response.json({token});
    }).catch(err =>{
        console.error(err);
        if (err.code ==='auth/wrong-password') return response.status(400).json({general:'Wrong credentials, please try again'});
        else return response.status(500).json({error:err.code});
    });
});



//https:://baseurlcom/api
exports.api = functions.https.onRequest(app);

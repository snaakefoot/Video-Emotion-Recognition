// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwGABtt8Dkyo8D0a83s4LI-gGdlhrQZUY",
  authDomain: "fir-auth-152d4.firebaseapp.com",
  projectId: "fir-auth-152d4",
  storageBucket: "fir-auth-152d4.appspot.com",
  messagingSenderId: "680496023718",
  appId: "1:680496023718:web:66fd42c52ea91eacba4c67"
};

// Initialize Firebase
let app;
if (firebase.apps.length===0) {
    app=firebase.initializeApp(firebaseConfig);
}else{
    app=firebase.app()
}
const auth=firebase.auth()
export{auth};
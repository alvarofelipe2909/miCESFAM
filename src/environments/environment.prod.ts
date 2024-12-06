import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const environment = {
  production : true,
  firebaseConfig : {
    apiKey: "AIzaSyD8z7t30vF9-7CYGNujq5IKVo9vw-2c1qw",
    authDomain: "micesfam-39406.firebaseapp.com",
    databaseURL: "https://micesfam-39406-default-rtdb.firebaseio.com",
    projectId: "micesfam-39406",
    storageBucket: "micesfam-39406.appspot.com",
    messagingSenderId: "899301906929",
    appId: "1:899301906929:web:62214fdfd6f1f716144c50"
  }
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
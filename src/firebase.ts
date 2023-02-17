import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2S3_eg5qZea7O7_W9dPw6yxsWkaobMis",
  authDomain: "team-reporter-88ec2.firebaseapp.com",
  projectId: "team-reporter-88ec2",
  storageBucket: "team-reporter-88ec2.appspot.com",
  messagingSenderId: "345672507358",
  appId: "1:345672507358:web:f385cecbdcd9260981c74f"
};

const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
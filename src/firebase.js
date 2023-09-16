import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-yfuc3AHtRXmYQqi6iTbyUbngHuCVOmw",
  authDomain: "libro-io.firebaseapp.com",
  projectId: "libro-io",
  storageBucket: "libro-io.appspot.com",
  messagingSenderId: "74969553755",
  appId: "1:74969553755:web:fed9ba379d78c2c498187e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

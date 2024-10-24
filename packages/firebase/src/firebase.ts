import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "estate-ad156.firebaseapp.com",
  projectId: "estate-ad156",
  storageBucket: "estate-ad156.appspot.com",
  messagingSenderId: "990382978633",
  appId: "1:990382978633:web:6dbfa19e3827838406f198",
};
export const app = initializeApp(firebaseConfig);

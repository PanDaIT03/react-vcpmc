import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD1vKFxreHpUZNy96W1o3fhz-_POR2hiDY",
    authDomain: "vcpmc-project.firebaseapp.com",
    projectId: "vcpmc-project",
    storageBucket: "vcpmc-project.appspot.com",
    messagingSenderId: "935382553518",
    appId: "1:935382553518:web:be80da886d76f9d8eaee3f",
    measurementId: "G-76QWQMFJFG",
  },
  app = initializeApp(firebaseConfig);

export const fireStoreDatabase = getFirestore(app);
export const auth = getAuth(app);

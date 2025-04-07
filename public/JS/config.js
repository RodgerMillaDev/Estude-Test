window.firebaseConfig = {
    apiKey: "AIzaSyDdJJdJsNAWSP30yC2gbkmjo_rBD6zWJ1A",
    authDomain: "estudetest.firebaseapp.com",
    projectId: "estudetest",
    storageBucket: "estudetest.firebasestorage.app",
    messagingSenderId: "718073634754",
    appId: "1:718073634754:web:76debaeaafd09751b8405b",
    measurementId: "G-6R1BEZ34GS"
  };


// Initialize Firebase only once
if (!window.firebaseApp) {
  window.firebaseApp = firebase.initializeApp(window.firebaseConfig);
}

// Global references for Firestore & Auth
window.dbFirestore = firebase.firestore();
window.auth = firebase.auth();

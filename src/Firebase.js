import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyDb6cZsIfEpe_Z2acKhxK_xyoaVYsZLpdU",
    authDomain: "applicant-ts.firebaseapp.com",
    databaseURL: "https://applicant-ts.firebaseio.com",
    projectId: "applicant-ts",
    storageBucket: "applicant-ts.appspot.com",
    messagingSenderId: "867970380030",
    appId: "1:867970380030:web:3839cd6b186fa4daea75af"
};


class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig)
        this.auth = app.auth()
        this.database = app.database()
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

    getCurrentUser = () => this.auth.currentUser
}

let FB = new Firebase()
export default FB
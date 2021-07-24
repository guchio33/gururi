import firebase from 'firebase'
import 'firebase/firestore'
import Vue from 'vue'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDX6Cqy2WGiFRiW0b8gXq3X3pdjDt6C9hE',
  authDomain: 'gururi-db37f.firebaseapp.com',
  projectId: 'gururi-db37f',
  storageBucket: 'gururi-db37f.appspot.com',
  messagingSenderId: '219413566946',
  appId: '1:219413566946:web:e6eceb6f1bfef2cdb5d5bb',
  measurementId: 'G-CH5FC28V89',
}

firebase.initializeApp(firebaseConfig)
// 以下ログイン機能関連
const initialUserState = {
  uid: '',
  displayName: '',
  photoURL: '',
}
const $auth = Vue.observable({
  currentUser: {
    ...initialUserState,
  },
})
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('logged')
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          firebase.firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        }
        Object.assign($auth.currentUser, doc.data())
      })
  } else {
    console.log('not logged')
    Object.assign($auth.currentUser, initialUserState)
  }
})
Vue.prototype.$auth = $auth

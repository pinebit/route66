/* global firebase */

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDa_YV_ULephd6M_F0fcx4uuVi5IvECHDY',
  authDomain: 'route66-ars.firebaseapp.com',
  databaseURL: 'https://route66-ars.firebaseio.com',
  projectId: 'route66-ars',
  storageBucket: 'route66-ars.appspot.com',
  messagingSenderId: '219060073910',
};

firebase.initializeApp(config);

export default firebase;


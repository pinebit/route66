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

function readArrayAsync(store, callback) {
  firebase.database().ref(store).on('value', (snapshot) => {
    const data = snapshot.val();
    let records = [];
    if (data) {
      const keys = Object.keys(data);
      records = keys.map(key => ({ key, ...data[key] }));
    }
    callback(records);
  });
}

export {
  readArrayAsync,
};

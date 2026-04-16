importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// We get these from the url query parameters or hardcode them, but Firebase requires config.
const firebaseConfig = {
  apiKey: "AIzaSyCfGa53lLv0RbCFADd4CkWaJLEHz1_BOoU",
  authDomain: "jewelry-shop-app-59a10.firebaseapp.com",
  projectId: "jewelry-shop-app-59a10",
  storageBucket: "jewelry-shop-app-59a10.firebasestorage.app",
  messagingSenderId: "418735362437",
  appId: "1:418735362437:web:ed9bff409cc971d25274ec",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

'use client';

import React, { useEffect } from 'react';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import app from '@/firebase/config';

export function NotificationListener() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const supported = await isSupported();
        if (!supported) {
          console.log('Firebase Messaging is not supported in this browser.');
          return;
        }

        const messaging = getMessaging(app);

        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log('[Foreground Message] ', payload);
          // Show a custom local notification/toast in your admin dashboard
          if (Notification.permission === 'granted') {
            new Notification(payload.notification?.title || 'New Notification', {
              body: payload.notification?.body,
              icon: '/favicon.ico',
            });
          }
        });

        // Request permission and get token
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Manually register the SW for Next.js compatibility
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          
          // Wait for the service worker to become active to avoid "Subscription failed - no active Service Worker"
          const serviceWorker = registration.installing || registration.waiting || registration.active;
          if (serviceWorker) {
            if (serviceWorker.state !== 'activated') {
              await new Promise<void>((resolve) => {
                serviceWorker.addEventListener('statechange', (e) => {
                  if ((e.target as ServiceWorker).state === 'activated') {
                    resolve();
                  }
                });
              });
            }
          }

          const token = await getToken(messaging, {
            serviceWorkerRegistration: registration,
          });
          
          if (token) {
            console.log('Admin Push Token received: ', token);
          }
        }
      } catch (err) {
        console.error('Error setting up admin notifications: ', err);
      }
    };

    setupNotifications();
  }, []);

  return null; // This component handles side effects only
}

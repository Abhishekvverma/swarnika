import { Platform } from 'react-native';

/**
  * Mock push notifications setup for development and compatibility with Expo Go.
  * Starting with SDK 53, expo-notifications remote notifications functionality was removed from Expo Go.
  * Using this virtual push notification setup prevents runtime crashes and warnings during local development.
  */
export async function registerForPushNotificationsAsync() {
  console.log('[Mock Push Notification] Virtually granting push token for development in Expo Go.');
  return 'ExponentPushToken[mock-local-token-for-dev]';
}

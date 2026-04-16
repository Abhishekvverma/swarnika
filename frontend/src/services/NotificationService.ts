import { Platform, Alert } from 'react-native';

export async function scheduleLocalNotification(title: string, body: string, delayMs: number = 1000) {
  // Mock implementation for Expo Go
  console.log(`[Mock Notification] Scheduled: ${title} - ${body} in ${delayMs}ms`);
}

export async function requestNotificationPermissions() {
  // Mock implementation for Expo Go
  console.log('[Mock Notification] Permissions "granted" virtually for Expo Go compatibility.');
  return true;
}

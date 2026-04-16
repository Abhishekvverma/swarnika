import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { tokens, title, body, data } = await request.json();

    if (!tokens || !tokens.length) {
      return NextResponse.json({ error: 'No tokens provided' }, { status: 400 });
    }

    // Filter to only Expo Push Tokens
    const expoTokens = tokens.filter((t: string) => t.startsWith('ExponentPushToken'));

    const messages = expoTokens.map((pushToken: string) => ({
      to: pushToken,
      sound: 'default',
      title: title || 'New Notification',
      body: body || '',
      data: data || {},
    }));

    if (messages.length > 0) {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });
      const responseData = await response.json();
      console.log('Expo Push Response:', responseData);
    }

    return NextResponse.json({ success: true, count: messages.length });
  } catch (error: any) {
    console.error('Error sending push notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

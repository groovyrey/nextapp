import { admin } from '/lib/firebase-admin';
import { auth } from 'firebase-admin';

export async function POST(req) {
  try {
    const { messageId } = await req.json();
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!idToken) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const decodedToken = await auth().verifyIdToken(idToken);
    if (decodedToken.authLevel !== 1) {
      return new Response(JSON.stringify({ message: 'Forbidden: Insufficient authorization' }), { status: 403 });
    }

    const db = admin.firestore();
    await db.collection('maindata').doc(messageId).delete();

    return new Response(JSON.stringify({ message: 'Message deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
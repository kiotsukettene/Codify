import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Load Firebase service account credentials from environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

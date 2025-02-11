import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Prevent Firebase from initializing multiple times
if (!admin.apps.length) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.error("❌ Firebase service account is missing in .env file.");
        process.exit(1);
    }

    const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig)
    });

    console.log("✅ Firebase Admin SDK initialized successfully.");
}

export default admin;

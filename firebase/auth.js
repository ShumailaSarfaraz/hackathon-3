import { 
  createUserWithEmailAndPassword as register, 
  signInWithEmailAndPassword as login, 
  signOut as logout, 
  updateProfile as update 
} from "firebase/auth";
import { 
  doc as getDocRef, 
  setDoc as saveDoc, 
  getDoc as fetchDoc 
} from "firebase/firestore";
import { auth, firestore } from "./firebase";

// Register a new user with email and additional details
export const createAccount = async (
  fullName,
  userAddress,
  userNickname,
  userPhone,
  userEmail,
  userPassword
) => {
  try {
    // Create user in Firebase Authentication
    const credentials = await register(auth, userEmail, userPassword);
    const newUser = credentials.user;

    // Update the user's display name in Firebase Auth
    await update(newUser, { displayName: fullName });

    // Save user details in Firestore
    const userData = {
      uid: newUser.uid,
      displayName: fullName,
      email: userEmail,
      createdAt: new Date().toISOString(),
      address: userAddress,
      username: userNickname,
      phone: userPhone,
    };

    // Save the user data to Firestore
    await saveDoc(getDocRef(firestore, "users", newUser.uid), userData);

    return newUser;
  } catch (error) {
    throw new Error(`Account creation failed: ${error.message}`);
  }
};

// Log in an existing user with email and password
export const authenticate = async (email, password) => {
  try {
    const credentials = await login(auth, email, password);
    return credentials.user;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

// Log out the current user
export const endSession = async () => {
  try {
    await logout(auth);
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};
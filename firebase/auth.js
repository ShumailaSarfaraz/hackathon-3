import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const registerUser = async (fullName, location, handle, contact, userEmail, userPass, role) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, userEmail, userPass);
    const { user } = newUser;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName,
      userEmail,
      role,
      ...(role === "buyer" && { location, handle, contact }),
      joinedOn: new Date().toISOString(),
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (userEmail, userPass) => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, userEmail, userPass);
    return credentials.user;
  } catch (err) {
    throw err;
  }
};

export const logOutUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    throw err;
  }
};

export const fetchUserRole = async (currentUser) => {
  if (!currentUser) return null;

  const userDocRef = doc(db, "users", currentUser.uid);
  const userSnapshot = await getDoc(userDocRef);

  return userSnapshot.exists() ? userSnapshot.data().role || "buyer" : "buyer";
};

export const checkIfAdmin = async (currentUser) => {
  const role = await fetchUserRole(currentUser);
  return role === "admin";
};

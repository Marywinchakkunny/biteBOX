import { auth, db } from '../Config/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Function to log in a user
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Store user data in local storage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to sign up a new user
export const signup = async (email, password, admissionNo, profilePictureUrl, roomNo) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      admissionNo: admissionNo,
      profilePictureUrl: profilePictureUrl || '', // Save the profile picture URL
      roomNo: roomNo || '' // Save the room number, if provided
    });

    // Store user data in local storage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to log out a user
export const logout = async () => {
  try {
    await auth.signOut();
    // Remove user data from local storage
    localStorage.removeItem('user');
  } catch (error) {
    throw error;
  }
};

// Function to update the room number for a user
export const updateRoomNo = async (userId, roomNo) => {
  try {
    await setDoc(doc(db, 'users', userId), { roomNo }, { merge: true });
    console.log('Room number updated successfully');
  } catch (error) {
    console.error('Error updating room number:', error.message);
  }
};

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '/lib/firebase';
import { showToast } from '../utils/toast';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch user data
  const fetchUserData = async (currentUser) => {
    try {
      const res = await fetch(`/api/user/${currentUser.uid}`);
      if (res.ok) {
        const data = await res.json();
        console.log("UserContext: Fetched user data:", data);
        setUserData(data);
      } else {
        showToast(`Failed to fetch user data from API: ${error.message}`, 'error');
        setUserData(null);
      }
    } catch (error) {
      showToast(`Error fetching user data: ${error.message}`, 'error');
      setUserData(null);
    }
  };

  // Function to refresh user data, exposed via context
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error('Failed to create session.');
      }
      showToast('Logged in successfully!', 'success');
    } catch (error) {
      showToast(`Login failed: ${error.message}`, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout');
      await signOut(auth);
    } catch (error) {
      showToast(`Logout failed: ${error.message}`, 'error');
      throw error;
    }
  };

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          // Fetch user data from Firestore via API
          const res = await fetch(`/api/user/${currentUser.uid}`);
          let fetchedUserData = null;
          if (res.ok) {
            fetchedUserData = await res.json();
            console.log("UserContext: Fetched user data:", fetchedUserData);
            setUserData(fetchedUserData);
          } else {
            showToast(`Failed to fetch user data from API: ${error.message}`, 'error');
            setUserData(null);
          }

          // Construct the user object with authLevel from fetchedUserData
          const userObject = {
            ...currentUser,
            idToken: await currentUser.getIdToken(), // Get the latest ID token
            authLevel: fetchedUserData ? fetchedUserData.authLevel : 0, // Use authLevel from Firestore
          };
          setUser(userObject);
        } else {
          setUser(null);
          setUserData(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, loading, login, logout, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
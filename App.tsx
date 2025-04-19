// App.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './lib/firebaseConfig';
import { ThemeProvider } from './context/ThemeContext';
import AppNavigator from './AppNavigator';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App started. Listening for auth state...');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed. User:', currentUser?.uid);
      setUser(currentUser);

      if (currentUser) {
        try {
          const docRef = doc(firestore, 'tasteProfiles', currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const mode = !!snap.data().darkMode;
            console.log('Dark mode fetched from Firestore:', mode);
            setDarkMode(mode);
          } else {
            console.log('Taste profile document does not exist, defaulting to light mode.');
            setDarkMode(false);
          }
        } catch (e) {
          console.error('Error fetching dark mode from Firestore:', e);
          setDarkMode(false);
        }
      } else {
        console.log('User is null. Defaulting to light mode.');
        setDarkMode(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading || darkMode === null) {
    console.log('Still loading user or theme...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading user & theme...</Text>
      </View>
    );
  }

  console.log('Rendering app with darkMode:', darkMode);
  return (
    <ThemeProvider initialDarkMode={darkMode}>
      <AppNavigator />
    </ThemeProvider>
  );
}

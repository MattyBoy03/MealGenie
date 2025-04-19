import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './lib/firebaseConfig';
import AppNavigator from './AppNavigator';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const docRef = doc(firestore, 'tasteProfiles', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const storedDarkMode = snap.data().darkMode;
            setDarkMode(storedDarkMode ?? false);
          }
        } catch (error) {
          console.log('Error fetching dark mode:', error);
        }
      }
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider initialDarkMode={darkMode}>
      <AppNavigator />
    </ThemeProvider>
  );
}

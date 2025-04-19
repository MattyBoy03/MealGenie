import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, firestore } from './lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import AppNavigator from './AppNavigator'; // Import AppNavigator

export default function App() {
  const [darkMode, setDarkMode] = useState(false); // State to track dark mode
  const [initialRoute, setInitialRoute] = useState<'SignUp' | 'Home' | 'TasteProfile' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const snap = await getDoc(doc(firestore, 'tasteProfiles', user.uid));
        if (snap.exists()) {
          const userData = snap.data();
          setDarkMode(userData?.darkMode || false); // Get dark mode from Firestore
        }

        const creationTime = new Date(user.metadata.creationTime!).getTime();
        const lastSignInTime = new Date(user.metadata.lastSignInTime!).getTime();
        const isNew = creationTime === lastSignInTime;
        setInitialRoute(isNew ? 'TasteProfile' : 'Home');
      } else {
        setInitialRoute('SignUp');
      }
    });

    return unsubscribe;
  }, []);

  if (initialRoute === null) return null; // Wait until initialRoute is set

  return (
    <ThemeProvider initialDarkMode={darkMode}> {/* Pass darkMode to ThemeProvider */}
      <AppNavigator />
    </ThemeProvider>
  );
}

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, Switch,
  Alert, StyleSheet, ActivityIndicator,
  Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { auth, firestore } from '../lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut, updatePassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const nav = useNavigation();
  const [cuisine, setCuisine] = useState('');
  const [allergies, setAllergies] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');
  const [budget, setBudget] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const snap = await getDoc(doc(firestore, 'tasteProfiles', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setCuisine(data.cuisine || '');
          setAllergies(data.allergies || '');
          setSpiceLevel(data.spiceLevel?.toString() || '');
          setBudget(data.budget?.toString() || '');
          setDarkMode(!!data.darkMode);
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Could not load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await setDoc(doc(firestore, 'tasteProfiles', user.uid), {
        cuisine,
        allergies,
        spiceLevel: Number(spiceLevel),
        budget: Number(budget),
        darkMode,
      }, { merge: true });
      Alert.alert('Saved!');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const toggleDark = async (v: boolean) => {
    setDarkMode(v);
    const user = auth.currentUser;
    if (!user) return;
    await setDoc(doc(firestore, 'tasteProfiles', user.uid), { darkMode: v }, { merge: true });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.heading}>Taste Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Favorite Cuisine"
          value={cuisine}
          onChangeText={setCuisine}
        />
        <TextInput
          style={styles.input}
          placeholder="Allergies"
          value={allergies}
          onChangeText={setAllergies}
        />
        <TextInput
          style={styles.input}
          placeholder="Spice Level (1–10)"
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={Keyboard.dismiss}
          value={spiceLevel}
          onChangeText={setSpiceLevel}
        />
        <TextInput
          style={styles.input}
          placeholder="Monthly Budget"
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={Keyboard.dismiss}
          value={budget}
          onChangeText={setBudget}
        />
        <Button title="Save Profile" onPress={saveProfile} />

        {/* ... rest of screen ... */}
        <View style={styles.switchRow}>
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleDark} />
        </View>
        <Button title="Log Out" onPress={() => {/* ... */}} color="red" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 10, marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginVertical: 30,
  },
});

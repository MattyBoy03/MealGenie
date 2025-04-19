import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, TextInput, Button, Switch,
  Alert, StyleSheet, ActivityIndicator,
  Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { auth, firestore } from '../lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut, updatePassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

export default function AccountScreen() {
  const nav = useNavigation();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [cuisine, setCuisine] = useState('');
  const [allergies, setAllergies] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');
  const [budget, setBudget] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
          if (typeof data.darkMode === 'boolean') {
            toggleDarkMode(data.darkMode);
          }
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

  const onToggleDark = async (value: boolean) => {
    toggleDarkMode(value);
    const user = auth.currentUser;
    if (!user) return;
    await setDoc(doc(firestore, 'tasteProfiles', user.uid), {
      darkMode: value,
    }, { merge: true });
  };

  if (loading) {
    const themedStyles = getStyles(darkMode);
    return (
      <View style={themedStyles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>Loading profile...</Text>
      </View>
    );
  }

  const themedStyles = getStyles(darkMode);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={themedStyles.container}>
        <Text style={themedStyles.heading}>Taste Profile</Text>
        <TextInput
          style={themedStyles.input}
          placeholder="Favorite Cuisine"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          value={cuisine}
          onChangeText={setCuisine}
        />
        <TextInput
          style={themedStyles.input}
          placeholder="Allergies"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          value={allergies}
          onChangeText={setAllergies}
        />
        <TextInput
          style={themedStyles.input}
          placeholder="Spice Level (1–10)"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={Keyboard.dismiss}
          value={spiceLevel}
          onChangeText={setSpiceLevel}
        />
        <TextInput
          style={themedStyles.input}
          placeholder="Monthly Budget"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={Keyboard.dismiss}
          value={budget}
          onChangeText={setBudget}
        />
        <Button title="Save Profile" onPress={saveProfile} />

        <View style={themedStyles.switchRow}>
          <Text style={themedStyles.label}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={onToggleDark} />
        </View>

        <Button
          title="Log Out"
          onPress={() => {
            signOut(auth);
            nav.navigate('Login' as never);
          }}
          color="red"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const getStyles = (darkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: darkMode ? '#121212' : '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: darkMode ? '#fff' : '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: darkMode ? '#555' : '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    color: darkMode ? '#fff' : '#000',
    backgroundColor: darkMode ? '#222' : '#fff',
  },
  label: {
    color: darkMode ? '#fff' : '#000',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 30,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { auth, firestore } from '../lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'TasteProfile'>;

export default function TasteProfileScreen() {
  const nav = useNavigation<NavProp>();
  const [cuisine, setCuisine] = useState('');
  const [allergies, setAllergies] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');  // string form
  const [budget, setBudget] = useState('');          // string form

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user signed in');
      return;
    }
    const ref = doc(firestore, 'tasteProfiles', user.uid);
    try {
      await setDoc(
        ref,
        {
          cuisine,
          allergies,
          spiceLevel: Number(spiceLevel),
          budget: Number(budget),
          darkMode: false, // default
        },
        { merge: true }
      );
      Alert.alert('Saved!');
      nav.navigate('Home');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save profile');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Taste Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Favorite Cuisines (ex. Italian, Thai)"
          value={cuisine}
          onChangeText={setCuisine}
        />

        <TextInput
          style={styles.input}
          placeholder="Preferences (ex. gluten-free, kosher)"
          value={allergies}
          onChangeText={setAllergies}
        />

        <TextInput
          style={styles.input}
          placeholder="Spice Level (1–10)"
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={Keyboard.dismiss}
          value={spiceLevel}
          onChangeText={setSpiceLevel}
        />

        <TextInput
          style={styles.input}
          placeholder="Monthly Budget ($)"
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={Keyboard.dismiss}
          value={budget}
          onChangeText={setBudget}
        />

        <Button title="Save Profile" onPress={handleSave} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});

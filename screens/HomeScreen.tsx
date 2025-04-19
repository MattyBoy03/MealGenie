import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { ThemeContext } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { darkMode } = useContext(ThemeContext);

  const styles = getStyles(darkMode);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MealGenie!</Text>
      <Button title="Recipe Finder" onPress={() => navigation.navigate('RecipeFinder')} />
      <Button title="Saved Recipes" onPress={() => navigation.navigate('SavedRecipes')} />
      <Button title="Account" onPress={() => navigation.navigate('Account')} />
    </View>
  );
}

const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: darkMode ? '#121212' : '#fff',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: darkMode ? '#fff' : '#000',
    },
  });

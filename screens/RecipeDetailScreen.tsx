// screens/RecipeDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigator';

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen() {
  const route = useRoute<RecipeDetailRouteProp>();
  const { recipeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Detail</Text>
      <Text>Recipe ID: {recipeId}</Text>
      {/* Replace this with full detail UI later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

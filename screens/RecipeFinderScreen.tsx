import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { searchRecipes } from '../lib/spoonacular';

// 👇 Define the correct type for navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecipeFinder'>;

export default function RecipeFinderScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [preferences, setPreferences] = useState<string[]>(['pasta', 'chicken']);
  const [budget, setBudget] = useState(20);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateRecipes = async () => {
    setLoading(true);
    const fetchedRecipes = await searchRecipes(preferences, budget);
    setRecipes(fetchedRecipes);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Finder</Text>

      {/* Budget Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your budget"
        keyboardType="numeric"
        value={String(budget)}
        onChangeText={(text) => setBudget(parseFloat(text))}
      />

      {/* Generate Recipes Button */}
      <Button title="Generate Recipes" onPress={handleGenerateRecipes} />

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={recipes}
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <Text style={styles.recipeName}>{item.title}</Text>
              <Text>Price: ${item.totalCost.toFixed(2)}</Text>
              {/* ✅ Navigation typed correctly now */}
              <Button
                title="View Recipe"
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
  },
  recipeItem: {
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

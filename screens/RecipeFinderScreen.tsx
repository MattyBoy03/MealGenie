import { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebaseConfig';
import axios from 'axios';

const db = getFirestore(app);

export default function RecipeFinderScreen() {
  const { darkMode } = useContext(ThemeContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [preferences, setPreferences] = useState<string[]>([]);
  const [budget, setBudget] = useState(20);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's saved preferences from Firestore
  useEffect(() => {
    const fetchPreferences = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }
    };
    fetchPreferences();
  }, []);

  // Search function for recipes
  const searchRecipes = async (preferences: string[], budget: number) => {
    try {
      const query = preferences.join(',') || 'chicken'; // Default query
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: '92cc191e28314d8396bedd2198a7a5c2', // Replace with your API key
          query,
          number: 10, // Max number of recipes
          maxCalories: budget * 50, // Budget-based calorie filter
        },
      });

      const data = response.data;
      if (!data || !data.results) {
        console.error('Error: Invalid data format from Spoonacular');
        return [];
      }

      return data.results.map((recipe: any) => ({
        ...recipe,
        totalCost: (Math.random() * budget).toFixed(2), // Fake cost for now
      }));
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  };

  const handleGenerateRecipes = async () => {
    setLoading(true);
    const fetchedRecipes = await searchRecipes(preferences, budget);
    setRecipes(fetchedRecipes);
    setLoading(false);
  };

  const handleSaveRecipe = async (recipe: any) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const recipeRef = doc(collection(db, 'users', user.uid, 'savedRecipes'), recipe.id.toString());
    await setDoc(recipeRef, recipe);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>Recipe Finder</Text>

      <TextInput
        style={[styles.input, { color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#444' : '#ccc' }]}
        placeholder="Enter your budget"
        placeholderTextColor={darkMode ? '#aaa' : '#888'}
        keyboardType="numeric"
        value={String(budget)}
        onChangeText={(text) => setBudget(parseFloat(text))}
      />

      <Button title="Generate Recipes" onPress={handleGenerateRecipes} />

      {loading ? (
        <Text style={{ color: darkMode ? '#fff' : '#000', marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.recipeItem, { backgroundColor: darkMode ? '#111' : '#f9f9f9' }]}>
              <Text style={[styles.recipeName, { color: darkMode ? '#fff' : '#000' }]}>{item.title}</Text>
              <Text style={{ color: darkMode ? '#ccc' : '#333' }}>Price: ${item.totalCost}</Text>
              <View style={styles.buttonRow}>
                <Button title="View" onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })} />
                <TouchableOpacity onPress={() => handleSaveRecipe(item)}>
                  <Text style={{ color: darkMode ? '#4dd' : '#007AFF', marginLeft: 10 }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  recipeItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
});

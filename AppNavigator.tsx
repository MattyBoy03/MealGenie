import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebaseConfig';

import SignUpScreen from './screens/SignUpScreen';
import LogInScreen from './screens/LogInScreen';
import TasteProfileScreen from './screens/TasteProfileScreen';
import HomeScreen from './screens/HomeScreen';
import RecipeFinderScreen from './screens/RecipeFinderScreen';
import SavedRecipesScreen from './screens/SavedRecipesScreen';
import AccountScreen from './screens/AccountScreen';

import { ThemeContext } from './context/ThemeContext'; // 👈 Grab theme context

export type RootStackParamList = {
  SignUp: undefined;
  LogIn: undefined;
  TasteProfile: undefined;
  Home: undefined;
  RecipeFinder: undefined;
  SavedRecipes: undefined;
  Account: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { darkMode } = useContext(ThemeContext); // 👈 Access dark mode
  const [initialRoute, setInitialRoute] = useState<'SignUp' | 'Home' | 'TasteProfile' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
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

  if (!initialRoute) return null;

  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={({ navigation, route }) => ({
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: darkMode ? '#000' : '#fff',
          },
          headerTitleStyle: {
            color: darkMode ? '#fff' : '#000',
          },
          headerTintColor: darkMode ? '#fff' : '#000',
        })}
      >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="TasteProfile" component={TasteProfileScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecipeFinder" component={RecipeFinderScreen} />
        <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

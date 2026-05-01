import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importar las pantallas
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PlatformDifferencesScreen from "../screens/PlatformDifferencesScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AuthHeaderActions from "../components/AuthHeaderActions";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: "#0f0f1e",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: "#0f0f1e",
          },
          headerRight:
            route.name === "Profile" ||
            route.name === "Login" ||
            route.name === "Register"
              ? undefined
              : () => <AuthHeaderActions />,
        })}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "🌌 SKYATLAS",
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            title: "Detalles del Evento",
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Perfil de Observador",
          }}
        />
        <Stack.Screen
          name="PlatformDifferences"
          component={PlatformDifferencesScreen}
          options={{
            title: "Android vs iOS",
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Iniciar sesion",
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: "Registrarse",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

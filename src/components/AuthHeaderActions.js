import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const AuthHeaderActions = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isCompact = width < 380;

  const handleNavigate = (target) => {
    if (route.name !== target) {
      navigation.navigate(target);
    }
  };

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleNavigate("Login")}
        style={[styles.button, styles.loginButton, isCompact && styles.buttonCompact]}
      >
        <Text style={[styles.buttonText, isCompact && styles.buttonTextCompact]}>
          Iniciar sesion
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleNavigate("Register")}
        style={[styles.button, styles.registerButton, isCompact && styles.buttonCompact]}
      >
        <Text style={[styles.buttonText, styles.registerText, isCompact && styles.buttonTextCompact]}>
          Registrarse
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  containerCompact: {
    gap: 6,
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonCompact: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  loginButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  registerButton: {
    backgroundColor: "#2ecc71",
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  buttonTextCompact: {
    fontSize: 11,
  },
  registerText: {
    letterSpacing: 0.2,
  },
});

export default AuthHeaderActions;

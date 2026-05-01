import React, { useContext, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const AuthHeaderActions = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isCompact = width < 420;
  const { currentUser, sessionToken, logoutUser } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const displayName = useMemo(() => {
    if (!currentUser) return "";
    return currentUser.name || currentUser.username || "Observador";
  }, [currentUser]);

  const handleNavigate = (target) => {
    if (route.name !== target) {
      navigation.navigate(target);
    }
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMenuVisible(false);
      }
    });
  };

  const handleAvatarPress = () => {
    if (menuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleGoProfile = () => {
    closeMenu();
    handleNavigate("Profile");
  };

  const handleGoLogin = () => {
    closeMenu();
    handleNavigate("Login");
  };

  const handleGoRegister = () => {
    closeMenu();
    handleNavigate("Register");
  };

  const handleLogout = () => {
    closeMenu();
    logoutUser();
    handleNavigate("Home");
  };

  const menuStyle = {
    opacity: menuAnim,
    transform: [
      { scale: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
      { translateY: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) },
    ],
  };

  if (!sessionToken) {
    return (
      <View style={[styles.container, isCompact && styles.containerCompact]}>
        {isCompact ? (
          <>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAvatarPress}
              style={[styles.menuButton, styles.menuButtonCompact]}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
            <Modal
              animationType="none"
              transparent
              visible={menuVisible}
              onRequestClose={closeMenu}
            >
              <Pressable style={styles.menuOverlay} onPress={closeMenu}>
                <Animated.View style={[styles.menuCard, menuStyle]}>
                  <Text style={styles.menuName}>Cuenta</Text>
                  <View style={styles.menuDivider} />
                  <Pressable style={styles.menuItem} onPress={handleGoLogin}>
                    <Text style={styles.menuItemText}>Iniciar sesion</Text>
                  </Pressable>
                  <Pressable style={styles.menuItem} onPress={handleGoRegister}>
                    <Text style={styles.menuItemText}>Registrarse</Text>
                  </Pressable>
                </Animated.View>
              </Pressable>
            </Modal>
          </>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleNavigate("Login")}
              style={[styles.button, styles.loginButton]}
            >
              <Text style={styles.buttonText}>Iniciar sesion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleNavigate("Register")}
              style={[styles.button, styles.registerButton]}
            >
              <Text style={[styles.buttonText, styles.registerText]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      {isCompact ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAvatarPress}
          style={[styles.menuButton, styles.menuButtonCompact]}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAvatarPress}
          style={[styles.avatarButton, isCompact && styles.avatarButtonCompact]}
        >
          <Text style={[styles.avatarText, isCompact && styles.avatarTextCompact]}>
            {displayName.slice(0, 1).toUpperCase() || "🪐"}
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="none"
        transparent
        visible={menuVisible}
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.menuOverlay} onPress={closeMenu}>
          <Animated.View style={[styles.menuCard, menuStyle]}>
            <Text style={styles.menuName}>{displayName}</Text>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={handleGoProfile}>
              <Text style={styles.menuItemText}>Ir a perfil</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuItemText, styles.menuLogout]}>
                Cerrar sesion
              </Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
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
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButtonCompact: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  avatarTextCompact: {
    fontSize: 12,
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
  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButtonCompact: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  menuButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  registerText: {
    letterSpacing: 0.2,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 20, 0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 64,
    paddingRight: 12,
  },
  menuCard: {
    width: 180,
    backgroundColor: "#121629",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
  },
  menuName: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 6,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    color: "#cfd3ff",
    fontSize: 13,
    fontWeight: "600",
  },
  menuLogout: {
    color: "#ff7a7a",
  },
});

export default AuthHeaderActions;

/* xd */ 

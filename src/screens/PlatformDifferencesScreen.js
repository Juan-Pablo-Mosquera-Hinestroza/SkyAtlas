import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import InfoRow from "../components/InfoRow";

const PlatformDifferencesScreen = () => {
  const isAndroid = Platform.OS === "android";

  const platformName = useMemo(
    () => (Platform.OS === "ios" ? "iOS" : "Android"),
    [],
  );

  const accentColor = isAndroid ? "#2ecc71" : "#4a90e2";

  const spacingLabel = isAndroid
    ? "Más amplio y táctil"
    : "Más compacto y limpio";

  const buttonLabel = isAndroid
    ? "Más contraste y elevación"
    : "Outline y menos sombras";

  const typographyLabel = isAndroid
    ? "Más marcada (bold)"
    : "Más sutil (semibold)";

  const handleDemoPress = () => {
    Alert.alert(
      platformName,
      isAndroid
        ? "Demo Android: botones grandes y acento llamativo."
        : "Demo iOS: estilo minimalista y lectura más limpia.",
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1e" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.hero,
            isAndroid ? styles.heroAndroid : styles.heroIOS,
            { borderColor: accentColor },
          ]}
        >
          <Text style={[styles.heroTitle, isAndroid && styles.heroTitleAndroid]}>
            Diferencias por Sistema
          </Text>
          <Text style={styles.heroSubtitle}>Sistema detectado: {platformName}</Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              isAndroid ? styles.sectionTitleAndroid : styles.sectionTitleIOS,
            ]}
          >
            🧩 Resumen
          </Text>
          <InfoRow label="Espaciado" value={spacingLabel} icon="📐" />
          <InfoRow label="Botones" value={buttonLabel} icon="🔘" />
          <InfoRow label="Tipografía" value={typographyLabel} icon="🔤" />
          <InfoRow
            label="Acento" 
            value={isAndroid ? "Verde (suave)" : "Azul (limpio)"}
            icon="🎨"
          />
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              isAndroid ? styles.sectionTitleAndroid : styles.sectionTitleIOS,
            ]}
          >
            ✅ Demo
          </Text>

          <TouchableOpacity
            onPress={handleDemoPress}
            activeOpacity={0.85}
            style={[
              styles.demoButton,
              isAndroid ? styles.demoButtonAndroid : styles.demoButtonIOS,
              isAndroid
                ? { backgroundColor: accentColor, shadowColor: accentColor }
                : { borderColor: accentColor },
            ]}
          >
            <Text
              style={[
                styles.demoButtonText,
                isAndroid ? styles.demoButtonTextAndroid : { color: accentColor },
              ]}
            >
              Probar comportamiento
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Nota: esta pantalla existe para mostrar claramente (en una sola vista)
            las diferencias Android/iOS solicitadas en el reto.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1e",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Platform.select({ ios: 16, android: 18 }),
    paddingTop: Platform.select({ ios: 16, android: 20 }),
    paddingBottom: Platform.select({ ios: 24, android: 30 }),
  },
  hero: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 14, android: 16 }),
    borderWidth: 1,
    marginBottom: Platform.select({ ios: 14, android: 18 }),
  },
  heroAndroid: {
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  heroIOS: {
    elevation: 0,
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  heroTitle: {
    fontSize: Platform.select({ ios: 22, android: 24 }),
    fontWeight: Platform.select({ ios: "700", android: "800" }),
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: Platform.select({ ios: 0.2, android: 0.6 }),
  },
  heroTitleAndroid: {
    textTransform: "uppercase",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#a0a0b0",
  },
  section: {
    marginBottom: Platform.select({ ios: 16, android: 20 }),
  },
  sectionTitle: {
    fontSize: Platform.select({ ios: 18, android: 20 }),
    fontWeight: Platform.select({ ios: "700", android: "800" }),
    color: "#ffffff",
    marginBottom: 12,
  },
  sectionTitleAndroid: {
    letterSpacing: 0.4,
  },
  sectionTitleIOS: {
    letterSpacing: 0.1,
  },
  demoButton: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.select({ ios: 12, android: 16 }),
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  demoButtonAndroid: {
    elevation: 7,
  },
  demoButtonIOS: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  demoButtonText: {
    fontSize: 15,
    fontWeight: Platform.select({ ios: "700", android: "800" }),
  },
  demoButtonTextAndroid: {
    color: "#0f0f1e",
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    color: "#a0a0b0",
  },
});

export default PlatformDifferencesScreen;

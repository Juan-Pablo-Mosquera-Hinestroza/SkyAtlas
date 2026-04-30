import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Alert,
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import InfoRow from "../components/InfoRow";

const DetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const isShortScreen = height < 700;
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Aun no has agregado este evento a tu perfil.",
  );
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // useCallback para memorizar la función de navegación
  const handleGoToProfile = useCallback(() => {
    setFeedbackMessage(`Evento ${event.title} agregado a tu perfil.`);
    Alert.alert("Evento agregado", `Se guardo ${event.title} en tu perfil.`, [
      { text: "OK" },
    ]);
    navigation.navigate("Profile", {
      eventName: event.title,
      eventType: event.type,
      eventDate: event.date,
      difficulty: event.difficulty,
      equipment: event.equipment,
    });
  }, [navigation, event]);

  const handleButtonPressIn = useCallback(() => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 24,
      bounciness: 5,
    }).start();
  }, [buttonScaleAnim]);

  const handleButtonPressOut = useCallback(() => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  }, [buttonScaleAnim]);

  // Memorizar el estilo del icono basado en el tamaño de pantalla
  const iconSize = useMemo(() => (isSmallScreen ? 60 : 80), [isSmallScreen]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1e" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isShortScreen && styles.scrollContentShort,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con icono y título */}
        <View style={[styles.header, isSmallScreen && styles.headerSmall]}>
          <View
            style={[
              styles.iconContainer,
              { width: iconSize, height: iconSize },
            ]}
          >
            <Text style={[styles.icon, { fontSize: iconSize * 0.6 }]}>
              {event.image}
            </Text>
          </View>
          <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
            {event.title}
          </Text>
          <View style={styles.typeBadge}>
            <Text
              style={[
                styles.typeBadgeText,
                isSmallScreen && styles.typeBadgeTextSmall,
              ]}
            >
              {event.type}
            </Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={[styles.section, isSmallScreen && styles.sectionSmall]}>
          <Text
            style={[
              styles.sectionTitle,
              isSmallScreen && styles.sectionTitleSmall,
            ]}
          >
            📖 Descripción
          </Text>
          <Text
            style={[
              styles.description,
              isSmallScreen && styles.descriptionSmall,
            ]}
          >
            {event.description}
          </Text>
        </View>

        {/* Información del evento */}
        <View style={[styles.section, isSmallScreen && styles.sectionSmall]}>
          <Text
            style={[
              styles.sectionTitle,
              isSmallScreen && styles.sectionTitleSmall,
            ]}
          >
            ℹ️ Información del Evento
          </Text>
          <InfoRow label="Fecha" value={event.date} icon="📅" />
          <InfoRow label="Hora" value={event.time} icon="🕐" />
          <InfoRow
            label="Mejor Momento"
            value={event.bestViewingTime}
            icon="⭐"
          />
          <InfoRow label="Duración" value={event.duration} icon="⏱️" />
          <InfoRow label="Visibilidad" value={event.visibility} icon="👁️" />
          <InfoRow label="Ubicación" value={event.location} icon="📍" />
        </View>

        {/* Detalles técnicos */}
        <View style={[styles.section, isSmallScreen && styles.sectionSmall]}>
          <Text
            style={[
              styles.sectionTitle,
              isSmallScreen && styles.sectionTitleSmall,
            ]}
          >
            🔬 Detalles Técnicos
          </Text>
          <InfoRow label="Magnitud" value={event.magnitude} icon="✨" />
          <InfoRow label="Constelación" value={event.constellation} icon="⭐" />
          <InfoRow label="Dificultad" value={event.difficulty} icon="📊" />
          <InfoRow label="Equipo" value={event.equipment} icon="🔭" />
        </View>

        {/* Consejos de observación */}
        <View style={[styles.section, isSmallScreen && styles.sectionSmall]}>
          <Text
            style={[
              styles.sectionTitle,
              isSmallScreen && styles.sectionTitleSmall,
            ]}
          >
            💡 Consejos de Observación
          </Text>
          <View style={styles.tipsContainer}>
            <Text style={[styles.tips, isSmallScreen && styles.tipsSmall]}>
              {event.tips}
            </Text>
          </View>
        </View>

        {/* Botón para ir al perfil */}
        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
          <TouchableOpacity
            style={[styles.button, isSmallScreen && styles.buttonSmall]}
            onPress={handleGoToProfile}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.buttonText,
                isSmallScreen && styles.buttonTextSmall,
              ]}
            >
              👤 Ver en Mi Perfil de Observador
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              isSmallScreen && styles.feedbackTextSmall,
            ]}
          >
            {feedbackMessage}
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  scrollContentShort: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerSmall: {
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: "#16213e",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  titleSmall: {
    fontSize: 22,
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  typeBadgeTextSmall: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionSmall: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#d0d0e0",
    lineHeight: 24,
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 12,
  },
  descriptionSmall: {
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
  },
  tipsContainer: {
    backgroundColor: "#1a3300",
    borderLeftWidth: 4,
    borderLeftColor: "#7fff00",
    padding: 16,
    borderRadius: 12,
  },
  tips: {
    fontSize: 15,
    color: "#d0d0e0",
    lineHeight: 22,
  },
  tipsSmall: {
    fontSize: 13,
    lineHeight: 19,
    padding: 12,
  },
  button: {
    backgroundColor: "#3f78ba",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonSmall: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  feedbackContainer: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#7fff00",
  },
  feedbackText: {
    color: "#d7e9ff",
    fontSize: 14,
    fontWeight: "500",
  },
  feedbackTextSmall: {
    fontSize: 12,
  },
});

export default DetailsScreen;

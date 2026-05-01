import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from "react-native";

import InfoRow from "../components/InfoRow";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ route }) => {
  const { width, height } = useWindowDimensions();
  const { currentUser } = useContext(AuthContext);

  // Lógica de responsividad
  const isSmallScreen = width < 380;
  const isMediumScreen = width >= 380 && width < 600;
  const isLargeScreen = width >= 600;
  const isShortScreen = height < 700;

  // Datos del observador (simulados)
  const observerData = useMemo(
    () => ({
      name: currentUser?.name || currentUser?.username || "Astro Observador",
      level: "Avanzado",
      eventsObserved: 47,
      favoriteType: "Lluvia de Meteoros",
      telescope: "Celestron NexStar 8SE",
      location: "Hemisferio Norte",
      experience: "3 años",
    }),
    [currentUser],
  );

  // Obtener datos del evento desde route params (si existen)
  const eventData = route.params || null;

  // Calcular columnas según tamaño de pantalla
  const columns = useMemo(() => {
    if (isLargeScreen) return 2;
    return 1;
  }, [isLargeScreen]);

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
        {/* Header del Perfil */}
        <View
          style={[
            styles.profileHeader,
            isSmallScreen && styles.profileHeaderSmall,
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              isSmallScreen && styles.avatarContainerSmall,
            ]}
          >
            <Text
              style={[
                styles.avatarIcon,
                isSmallScreen && styles.avatarIconSmall,
              ]}
            >
              👨‍🚀
            </Text>
          </View>
          <Text
            style={[
              styles.profileName,
              isSmallScreen && styles.profileNameSmall,
            ]}
          >
            {observerData.name}
          </Text>
          <View style={styles.levelBadge}>
            <Text
              style={[
                styles.levelBadgeText,
                isSmallScreen && styles.levelBadgeTextSmall,
              ]}
            >
              ⭐ {observerData.level}
            </Text>
          </View>
        </View>

        {/* Estadísticas del Observador */}
        <View style={[styles.section, isSmallScreen && styles.sectionSmall]}>
          <Text
            style={[
              styles.sectionTitle,
              isSmallScreen && styles.sectionTitleSmall,
            ]}
          >
            📊 Estadísticas
          </Text>
          <View
            style={[
              styles.statsContainer,
              isLargeScreen && styles.statsContainerLarge,
            ]}
          >
            <View
              style={[styles.statBox, isSmallScreen && styles.statBoxSmall]}
            >
              <Text
                style={[
                  styles.statNumber,
                  isSmallScreen && styles.statNumberSmall,
                ]}
              >
                {observerData.eventsObserved}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  isSmallScreen && styles.statLabelSmall,
                ]}
              >
                Eventos Observados
              </Text>
            </View>
            <View
              style={[styles.statBox, isSmallScreen && styles.statBoxSmall]}
            >
              <Text
                style={[
                  styles.statNumber,
                  isSmallScreen && styles.statNumberSmall,
                ]}
              >
                {observerData.experience}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  isSmallScreen && styles.statLabelSmall,
                ]}
              >
                de Experiencia
              </Text>
            </View>
          </View>
        </View>

        {/* Información del Observador */}
        <View style={[styles.section, isSmallScreen && styles.sectionSmall]}>
          <Text
            style={[
              styles.sectionTitle,
              isSmallScreen && styles.sectionTitleSmall,
            ]}
          >
            👤 Información Personal
          </Text>
          <InfoRow
            label="Tipo Favorito"
            value={observerData.favoriteType}
            icon="❤️"
          />
          <InfoRow
            label="Telescopio"
            value={observerData.telescope}
            icon="🔭"
          />
          <InfoRow label="Ubicación" value={observerData.location} icon="📍" />
          <InfoRow label="Nivel" value={observerData.level} icon="🎯" />
        </View>

        {/* Evento Seleccionado (si existe) */}
        {eventData && (
          <View style={[styles.section, isSmallScreen && styles.sectionSmall]}>
            <Text
              style={[
                styles.sectionTitle,
                isSmallScreen && styles.sectionTitleSmall,
              ]}
            >
              🎯 Evento de Interés
            </Text>
            <View
              style={[
                styles.eventHighlight,
                isSmallScreen && styles.eventHighlightSmall,
              ]}
            >
              <Text
                style={[
                  styles.eventHighlightTitle,
                  isSmallScreen && styles.eventHighlightTitleSmall,
                ]}
              >
                {eventData.eventName}
              </Text>
              <View style={styles.eventDetailRow}>
                <View style={styles.eventDetailItem}>
                  <Text
                    style={[
                      styles.eventDetailLabel,
                      isSmallScreen && styles.eventDetailLabelSmall,
                    ]}
                  >
                    Tipo
                  </Text>
                  <Text
                    style={[
                      styles.eventDetailValue,
                      isSmallScreen && styles.eventDetailValueSmall,
                    ]}
                  >
                    {eventData.eventType}
                  </Text>
                </View>
                <View style={styles.eventDetailItem}>
                  <Text
                    style={[
                      styles.eventDetailLabel,
                      isSmallScreen && styles.eventDetailLabelSmall,
                    ]}
                  >
                    Fecha
                  </Text>
                  <Text
                    style={[
                      styles.eventDetailValue,
                      isSmallScreen && styles.eventDetailValueSmall,
                    ]}
                  >
                    {eventData.eventDate}
                  </Text>
                </View>
              </View>
            </View>

            {/* Preparación para el evento */}
            <View
              style={[
                styles.preparationBox,
                isSmallScreen && styles.preparationBoxSmall,
              ]}
            >
              <Text
                style={[
                  styles.preparationTitle,
                  isSmallScreen && styles.preparationTitleSmall,
                ]}
              >
                📝 Preparación Necesaria
              </Text>
              <InfoRow
                label="Dificultad"
                value={eventData.difficulty}
                icon="📊"
              />
              <InfoRow
                label="Equipo Necesario"
                value={eventData.equipment}
                icon="🔭"
              />

              <View
                style={[
                  styles.checklistContainer,
                  isSmallScreen && styles.checklistContainerSmall,
                ]}
              >
                <Text
                  style={[
                    styles.checklistTitle,
                    isSmallScreen && styles.checklistTitleSmall,
                  ]}
                >
                  ✅ Lista de Verificación:
                </Text>
                <Text
                  style={[
                    styles.checklistItem,
                    isSmallScreen && styles.checklistItemSmall,
                  ]}
                >
                  • Verificar condiciones meteorológicas
                </Text>
                <Text
                  style={[
                    styles.checklistItem,
                    isSmallScreen && styles.checklistItemSmall,
                  ]}
                >
                  • Preparar equipo: {eventData.equipment}
                </Text>
                <Text
                  style={[
                    styles.checklistItem,
                    isSmallScreen && styles.checklistItemSmall,
                  ]}
                >
                  • Encontrar ubicación con poca luz
                </Text>
                <Text
                  style={[
                    styles.checklistItem,
                    isSmallScreen && styles.checklistItemSmall,
                  ]}
                >
                  • Configurar alarma para la fecha: {eventData.eventDate}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Mensaje si no hay evento seleccionado */}
        {!eventData && (
          <View
            style={[styles.noEventBox, isSmallScreen && styles.noEventBoxSmall]}
          >
            <Text
              style={[
                styles.noEventText,
                isSmallScreen && styles.noEventTextSmall,
              ]}
            >
              🌟 Selecciona un evento desde la pantalla de detalles para ver tu
              preparación personalizada
            </Text>
          </View>
        )}
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: "#16213e",
    borderRadius: 16,
  },
  profileHeaderSmall: {
    marginBottom: 16,
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#4a90e2",
  },
  avatarContainerSmall: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 50,
  },
  avatarIconSmall: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  profileNameSmall: {
    fontSize: 24,
  },
  levelBadge: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelBadgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  levelBadgeTextSmall: {
    fontSize: 12,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  statsContainerLarge: {
    justifyContent: "space-evenly",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#16213e",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  statBoxSmall: {
    padding: 16,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 4,
  },
  statNumberSmall: {
    fontSize: 28,
  },
  statLabel: {
    fontSize: 14,
    color: "#a0a0b0",
    textAlign: "center",
  },
  statLabelSmall: {
    fontSize: 12,
  },
  eventHighlight: {
    backgroundColor: "#0f2a1a",
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventHighlightSmall: {
    padding: 12,
  },
  eventHighlightTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 12,
  },
  eventHighlightTitleSmall: {
    fontSize: 18,
  },
  eventDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  eventDetailItem: {
    flex: 1,
  },
  eventDetailLabel: {
    fontSize: 12,
    color: "#a0a0b0",
    marginBottom: 4,
  },
  eventDetailLabelSmall: {
    fontSize: 11,
  },
  eventDetailValue: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
  },
  eventDetailValueSmall: {
    fontSize: 13,
  },
  preparationBox: {
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 12,
  },
  preparationBoxSmall: {
    padding: 12,
  },
  preparationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  preparationTitleSmall: {
    fontSize: 16,
  },
  checklistContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
  },
  checklistContainerSmall: {
    marginTop: 10,
    padding: 10,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 8,
  },
  checklistTitleSmall: {
    fontSize: 14,
  },
  checklistItem: {
    fontSize: 14,
    color: "#d0d0e0",
    marginBottom: 6,
    lineHeight: 20,
  },
  checklistItemSmall: {
    fontSize: 12,
    lineHeight: 18,
  },
  noEventBox: {
    backgroundColor: "#16213e",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  noEventBoxSmall: {
    padding: 16,
  },
  noEventText: {
    fontSize: 16,
    color: "#a0a0b0",
    textAlign: "center",
    lineHeight: 24,
  },
  noEventTextSmall: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ProfileScreen;

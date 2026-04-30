import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";

const EventCard = React.memo(({ event, onPress }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const isAndroid = Platform.OS === "android";
  const accentColor = isAndroid ? "#2ecc71" : "#4a90e2";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSmallScreen && styles.cardSmall,
        isAndroid ? styles.cardAndroid : styles.cardIOS,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{event.image}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[styles.title, isSmallScreen && styles.titleSmall]}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        <View style={styles.infoRow}>
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Text
              style={[
                styles.badgeText,
                isAndroid && styles.badgeTextAndroid,
              ]}
            >
              {event.type}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={[styles.date, isSmallScreen && styles.dateSmall]}>
            📅 {event.date}
          </Text>
          <Text
            style={[styles.visibility, getVisibilityStyle(event.visibility)]}
          >
            {event.visibility}
          </Text>
        </View>

        <Text
          style={[styles.location, isSmallScreen && styles.locationSmall]}
          numberOfLines={1}
        >
          📍 {event.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const getVisibilityStyle = (visibility) => {
  switch (visibility) {
    case "Muy Alta":
      return styles.visibilityVeryHigh;
    case "Alta":
      return styles.visibilityHigh;
    case "Media":
      return styles.visibilityMedium;
    default:
      return styles.visibilityLow;
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  cardAndroid: {
    borderWidth: 2,
    borderColor: "#2ecc71",
    elevation: 8,
    shadowColor: "#2ecc71",
  },
  cardIOS: {
    elevation: 0,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardSmall: {
    padding: 12,
    marginHorizontal: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#16213e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 32,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  titleSmall: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextAndroid: {
    color: "#0f0f1e",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  date: {
    color: "#a0a0b0",
    fontSize: 14,
  },
  dateSmall: {
    fontSize: 12,
  },
  visibility: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  visibilityVeryHigh: {
    color: "#2ecc71",
    backgroundColor: "#0a2212",
  },
  visibilityHigh: {
    color: "#2ecc71",
    backgroundColor: "#0f2a1a",
  },
  visibilityMedium: {
    color: "#ffaa00",
    backgroundColor: "#332200",
  },
  visibilityLow: {
    color: "#ff4444",
    backgroundColor: "#330000",
  },
  location: {
    color: "#8888a0",
    fontSize: 13,
  },
  locationSmall: {
    fontSize: 11,
  },
});

export default EventCard;

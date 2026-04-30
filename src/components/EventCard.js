import React, { useCallback, useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const EventCard = React.memo(({ event, onPress }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 25,
      bounciness: 5,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, isSmallScreen && styles.cardSmall]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.88}
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
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{event.type}</Text>
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
    </Animated.View>
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
    backgroundColor: "#171f35",
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
    borderColor: "#2d4f7a",
  },
  cardSmall: {
    padding: 12,
    marginHorizontal: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1f2c4f",
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
    marginBottom: 10,
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
    backgroundColor: "#3f78ba",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  date: {
    color: "#c2d2e5",
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
    color: "#00ff00",
    backgroundColor: "#003300",
  },
  visibilityHigh: {
    color: "#7fff00",
    backgroundColor: "#1a3300",
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
    color: "#9eb3ce",
    fontSize: 13,
  },
  locationSmall: {
    fontSize: 11,
  },
});

export default EventCard;

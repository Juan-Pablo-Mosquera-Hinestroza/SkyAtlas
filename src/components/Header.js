import React from "react";
import { View, Text, StyleSheet, useWindowDimensions, Platform } from "react-native";

const Header = React.memo(({ title, subtitle, children }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const isAndroid = Platform.OS === "android";

  return (
    <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
      <Text
        style={[
          styles.title,
          isSmallScreen && styles.titleSmall,
          isAndroid ? styles.titleAndroid : styles.titleIOS,
        ]}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            isSmallScreen && styles.subtitleSmall,
            isAndroid ? styles.subtitleAndroid : styles.subtitleIOS,
          ]}
        >
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  containerSmall: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  titleAndroid: {
    letterSpacing: 0.6,
  },
  titleIOS: {
    letterSpacing: 0.2,
  },
  titleSmall: {
    fontSize: 26,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0b0",
  },
  subtitleAndroid: {
    letterSpacing: 0.2,
  },
  subtitleIOS: {
    letterSpacing: 0.1,
  },
  subtitleSmall: {
    fontSize: 14,
  },
});

export default Header;

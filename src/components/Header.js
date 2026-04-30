import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

const Header = React.memo(({ title, subtitle }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  return (
    <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
      <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, isSmallScreen && styles.subtitleSmall]}>
          {subtitle}
        </Text>
      )}
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
  titleSmall: {
    fontSize: 26,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0b0",
  },
  subtitleSmall: {
    fontSize: 14,
  },
});

export default Header;

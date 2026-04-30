import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

const InfoRow = React.memo(({ label, value, icon }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.label, isSmallScreen && styles.labelSmall]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.value, isSmallScreen && styles.valueSmall]}>
        {value}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#16213e",
    borderRadius: 12,
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  label: {
    color: "#a0a0b0",
    fontSize: 15,
    fontWeight: "500",
  },
  labelSmall: {
    fontSize: 13,
  },
  value: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    maxWidth: "50%",
    textAlign: "right",
  },
  valueSmall: {
    fontSize: 13,
  },
});

export default InfoRow;

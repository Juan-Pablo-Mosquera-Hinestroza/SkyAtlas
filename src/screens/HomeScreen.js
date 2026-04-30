import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from "react-native";

import EventCard from "../components/EventCard";
import Header from "../components/Header";
import { astronomicalEvents } from "../data/astronomicalEvents";

const HomeScreen = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Explora los eventos y toca uno para ver detalles.",
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // useCallback para memorizar la función de navegación
  const handleEventPress = useCallback(
    (event) => {
      setFeedbackMessage(`Abriendo ${event.title}...`);
      navigation.navigate("Details", { event });
    },
    [navigation],
  );

  // Renderizar cada item con useCallback para evitar re-renders innecesarios
  const renderItem = useCallback(
    ({ item }) => (
      <EventCard event={item} onPress={() => handleEventPress(item)} />
    ),
    [handleEventPress],
  );

  // keyExtractor optimizado
  const keyExtractor = useCallback((item) => item.id, []);

  // getItemLayout para mejor performance (altura estimada del card)
  const getItemLayout = useCallback(
    (data, index) => ({
      length: 140,
      offset: 140 * index,
      index,
    }),
    [],
  );

  // Header component memorizado
  const ListHeaderComponent = useMemo(
    () => (
      <View>
        <Header
          title="Eventos Astronómicos"
          subtitle="Planifica tu próxima observación nocturna"
        />
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </View>
      </View>
    ),
    [feedbackMessage],
  );

  // Separador entre items
  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1e" />
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <FlatList
          data={astronomicalEvents}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={ItemSeparatorComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Optimizaciones de performance
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={8}
          windowSize={10}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1e",
  },
  animatedContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 28,
  },
  feedbackContainer: {
    backgroundColor: "#16213e",
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4a90e2",
  },
  feedbackText: {
    color: "#d7e9ff",
    fontSize: 14,
    fontWeight: "600",
  },
  separator: {
    height: 4,
  },
});

export default HomeScreen;

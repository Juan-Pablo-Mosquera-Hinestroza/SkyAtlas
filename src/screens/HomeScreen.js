import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  Keyboard,
  Modal,
  Pressable,
  Share,
} from "react-native";

import EventCard from "../components/EventCard";
import Header from "../components/Header";
import { astronomicalEvents } from "../data/astronomicalEvents";
import {
  formatDate,
  getDaysUntilEvent,
  getFutureEvents,
  searchEvents,
  sortByDate,
} from "../utils/helpers";

const AI_ROBOT_ICON_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD6klEQVR4nO2YTWxVVRDHf6VFWrsqKjSQFEoXBSX1I6GKyseCYgVsF8ZEQ1QWaFyZblxAEZAQjW4KdA8UwsZVRT4iX4mWbiCR2kKBWIiLQjAtXYIkJDWT/G8yudz33r2Pvmsb7z85yc3/nDNz5twzc2YOZMiQIUOGDBn+X5gFrAA+A74BDgBHgRNAPzAM3ALuARNqD4FJtX8cf09jhzX3hGSZzD3A50CzdE4Z5gBfAaNuUWm1O9Jta3gqNALXnODbwCFgF/Al8DGwCXgLeAlYAtQCNWqVTlal42s19kXN3SRZJnOndNx2eu3PLS3WCFMy5gS1AmWki3fcRo5psxLhWeCGBNj5rS7NOmOv5bjWcjPpWrZr4mDoeJQD64EdwD6gB/gJ+A0YKuDsDyOcfUhzTcZhoAvoBFqkK4Ct4Q/JMd0F0R9ytrWuz870lRQdfQBocPrXhPov5jPEDxxxfIX8xPg/ge+ADuBToA1YBSyXsfOcU/toM8fx8zR2uea2SZbJ/FY6JnW8TXeAm6E1xjLEjk2Ad8VdT8lfqt3GbXT8wWIMMT8JsEuc7VZa2Cudux23rRhD3nf8MXFbYvhVX4xFxpnzifpMd4APijHkZcdfFreywJyCChLMeUP8Jce9Wowhixz/VwRXakPqxJvuAAuKMWSu4+9HcKU2pEa86Q7wXDGGPOP4RxFcgL7QPLvgCiHOnNnqM90+mpXMkFKhIsKQiriG+J2y3xhgPIIrNWoijhZy/lh//k5CZy8V6iKcPRF+l4BXIsLvmzFlhH0g6T2TK/wmwqmEF2JSQ+IEg1wXouEs8AsxsD8iRdk5TVKUBrch9YUEfKGBVh+Ek8YbKSaN1yOSxs3OkI8KCWnWQEulA5S7knPEpfF21NpVKzQpNV/o0vUqJ6PK8Qs1tklz2yWrQ7JHpGs4lMZ3O0Ps5OTFLFVw4cKq3gWCNNoVGevhH0Ksei2Izjyl7jr1d+n49QK/auwthe+gpH2Qo9S9q7GDoVJ3n0rZllCpa1gtOaPuiohKYp8o+IPC5uR//PiAno+GXRD6Wt9XVW3mxTLgb00wx9uQ8nNQGfA68INLWgfka1XuMWJcY5rzra9Rv3/S3bI97oHOYv17wNuuZl+Qw9krHF8jn2vSA12riiZ/CV8I+UxvKEV6wT0TBe1cvp2pVDQJ0pRSNvOfAOdDfeZHzz+NIf5XvwZsdY/YR4CfdZNflQOP5nD2x46f0MYMquw9DfyoO8zra9axGY84WsFJsb7v9cCe9ktoYsx3zt6Z1NmnG1a58Hs3bvidrriW9EKcruh2htiFPGOx2RnyITMYS5whi5nhOBO3sMqQganDv28GHY36aKptAAAAAElFTkSuQmCC";

const normalizeText = (value) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const detectMonthNumber = (normalizedText) => {
  const monthMap = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    setiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };

  const match = Object.entries(monthMap).find(([name]) =>
    normalizedText.includes(name),
  );

  return match ? match[1] : null;
};

const formatEventLine = (event) => {
  const days = getDaysUntilEvent(event.date);
  const daysText = Number.isFinite(days) ? ` (en ${days} días)` : "";
  return `${event.image} ${event.title} — ${formatDate(event.date)}${daysText}`;
};

const formatTime = (date) =>
  date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateLabel = (date) =>
  date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const createMessage = (type, text, status = "received") => ({
  id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  text,
  timestamp: new Date(),
  status,
});

const initialBotMessage = createMessage(
  "bot",
  '¡Hola! Soy Astro-IA. Pregúntame por eclipses, meteoros, la Luna o recomendaciones astronómicas.',
);

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState([initialBotMessage]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatListRef = useRef(null);

  const platformName = useMemo(
    () => (Platform.OS === "ios" ? "iOS" : "Android"),
    [],
  );

  const isAndroid = Platform.OS === "android";

  const upcomingEvents = useMemo(
    () => sortByDate(getFutureEvents(astronomicalEvents), "asc"),
    [],
  );

  const generateAiAnswer = useCallback(
    (rawInput) => {
      const input = rawInput.trim();
      if (!input) {
        return "Escribe una pregunta (por ejemplo: \"próximo eclipse\").";
      }

      const normalized = normalizeText(input);
      const monthNumber = detectMonthNumber(normalized);

      if (/(hola|buenas|hey|saludos)/.test(normalized)) {
        const next = upcomingEvents[0];
        return next
          ? `¡Hola! Si quieres algo rápido, tu próximo evento recomendado es:\n${formatEventLine(next)}`
          : "¡Hola! No encontré eventos futuros en la lista, pero puedo ayudarte con tips de observación.";
      }

      if (/(recomiend|sugier|que ver|plan)/.test(normalized)) {
        const picks = upcomingEvents.slice(0, 3);
        if (picks.length === 0) {
          return "No encontré eventos futuros para recomendar.";
        }

        return `Te recomiendo estos eventos próximos:\n${picks
          .map((e) => `• ${formatEventLine(e)}`)
          .join("\n")}`;
      }

      if (normalized.includes("eclipse")) {
        const eclipse = upcomingEvents.find((e) =>
          normalizeText(e.type).includes("eclipse"),
        );

        return eclipse
          ? `Próximo eclipse:\n• ${formatEventLine(eclipse)}\nTip: en eclipse solar usa protección certificada ISO 12312-2.`
          : "No encontré eclipses próximos en la lista. Prueba con: \"recomiéndame un evento\".";
      }

      if (/(meteoro|meteor|lluvia|perseid|geminid|lirid)/.test(normalized)) {
        const shower = upcomingEvents.find((e) =>
          normalizeText(e.type).includes("lluvia de meteoros"),
        );

        return shower
          ? `Para meteoros, este es el próximo buen candidato:\n• ${formatEventLine(shower)}\nTip: aléjate de luces y espera 20–30 min para adaptar la vista.`
          : "No encontré lluvias de meteoros próximas en la lista. Prueba con: \"eventos en agosto\".";
      }

      if (/(luna|superluna)/.test(normalized)) {
        const moon = upcomingEvents.find((e) =>
          normalizeText(e.type).includes("luna llena"),
        );

        return moon
          ? `Evento lunar recomendado:\n• ${formatEventLine(moon)}\nTip: buen momento para foto con trípode.`
          : "No encontré eventos de Luna llena próximos en la lista.";
      }

      if (/(iss|estacion|sateli)/.test(normalized)) {
        const iss = upcomingEvents.find((e) =>
          normalizeText(e.type).includes("satel"),
        );

        return iss
          ? `Sobre satélites/ISS:\n• ${formatEventLine(iss)}\nTip: parece una “estrella” brillante moviéndose rápido.`
          : "No encontré pases de satélite/ISS próximos en la lista.";
      }

      if (monthNumber) {
        const eventsInMonth = upcomingEvents.filter((e) => {
          const d = new Date(e.date);
          return d.getMonth() + 1 === monthNumber;
        });

        if (eventsInMonth.length === 0) {
          return "No encontré eventos futuros en ese mes en la lista.";
        }

        const sample = eventsInMonth.slice(0, 4);
        return `Eventos en ese mes (${eventsInMonth.length}):\n${sample
          .map((e) => `• ${formatEventLine(e)}`)
          .join("\n")}`;
      }

      const matches = searchEvents(astronomicalEvents, input).slice(0, 3);
      if (matches.length > 0) {
        return `Encontré coincidencias:\n${matches
          .map((e) => `• ${formatEventLine(e)}`)
          .join("\n")}`;
      }

      return 'No entendí del todo. Prueba con: "recomiéndame un evento", "próximo eclipse" o "eventos en abril".';
    },
    [upcomingEvents],
  );

  const filteredMessages = useMemo(() => {
    const query = normalizeText(searchQuery.trim());
    if (!query) return messages;
    return messages.filter((message) =>
      normalizeText(message.text).includes(query),
    );
  }, [messages, searchQuery]);

  useEffect(() => {
    if (chatListRef.current && messages.length > 0) {
      chatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isAiOpen]);

  const handleAiSend = useCallback(() => {
    const question = aiInput.trim();
    if (!question) return;

    const userMessage = createMessage("user", question, "sent");
    setMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    Keyboard.dismiss();
    setIsBotTyping(true);

    const answerText = generateAiAnswer(question);
    setTimeout(() => {
      const botMessage = createMessage("bot", answerText, "received");
      setMessages((prev) => [...prev, botMessage]);
      setIsBotTyping(false);
    }, 700);
  }, [aiInput, generateAiAnswer]);

  const handleAiQuickFill = useCallback((text) => {
    setAiInput(text);
  }, []);

  const handleExportConversation = useCallback(async () => {
    const transcript = messages
      .map((message) => {
        const prefix = message.type === "user" ? "Tú" : "Astro-IA";
        return `${prefix} (${formatTime(message.timestamp)}): ${message.text}`;
      })
      .join("\n\n");

    try {
      await Share.share({
        message: transcript,
      });
    } catch (error) {
      Alert.alert("Exportar", "No se pudo exportar la conversación.");
    }
  }, [messages]);

  const handleAiOpen = useCallback(() => {
    setIsAiOpen(true);
  }, []);

  const handleAiClose = useCallback(() => {
    setIsAiOpen(false);
    Keyboard.dismiss();
  }, []);

  const renderChatItem = useCallback(
    ({ item, index }) => {
      const previous = filteredMessages[index - 1];
      const showDateDivider =
        !previous ||
        item.timestamp.toDateString() !== previous.timestamp.toDateString();
      const isUser = item.type === "user";

      return (
        <>
          {showDateDivider && (
            <View style={styles.dateDivider}>
              <Text style={styles.dateDividerText}>
                {formatDateLabel(item.timestamp)}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.messageRow,
              isUser ? styles.messageRowUser : styles.messageRowBot,
            ]}
          >
            {!isUser && (
              <View style={styles.avatarBubble}>
                <Text style={styles.avatarText}>🤖</Text>
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isUser ? styles.userMessageText : styles.botMessageText,
                ]}
              >
                {item.text}
              </Text>
              <View style={styles.messageMeta}>
                <Text style={styles.messageTime}>
                  {formatTime(item.timestamp)}
                </Text>
                {isUser && (
                  <Text style={styles.messageStatus}>Enviado</Text>
                )}
              </View>
            </View>
            {isUser && (
              <View style={styles.avatarBubble}>
                <Text style={styles.avatarText}>🧑</Text>
              </View>
            )}
          </View>
        </>
      );
    },
    [filteredMessages],
  );

  const handlePlatformInfoPress = useCallback(() => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Experiencia Android",
        "Botones más visibles y acento más llamativo para facilitar los toques.",
      );
      return;
    }

    Alert.alert(
      "Experiencia iOS",
      "Diseño más minimalista y limpio para una lectura más cómoda.",
    );
  }, []);

  const handleGoToPlatformDifferences = useCallback(() => {
    navigation.navigate("PlatformDifferences");
  }, [navigation]);

  // useCallback para memorizar la función de navegación
  const handleEventPress = useCallback(
    (event) => {
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
          subtitle="Próximos eventos celestiales observables"
        >
          <View style={styles.platformRow}>
            <View
              style={[
                styles.platformChip,
                isAndroid ? styles.platformChipAndroid : styles.platformChipIOS,
              ]}
            >
              <Text
                style={[
                  styles.platformChipText,
                  isAndroid
                    ? styles.platformChipTextAndroid
                    : styles.platformChipTextIOS,
                ]}
              >
                Sistema: {platformName}
              </Text>
            </View>

            <View style={styles.platformActions}>
              <TouchableOpacity
                onPress={handlePlatformInfoPress}
                activeOpacity={0.85}
                style={[
                  styles.platformButton,
                  isAndroid
                    ? styles.platformButtonAndroid
                    : styles.platformButtonIOS,
                ]}
              >
                <Text
                  style={[
                    styles.platformButtonText,
                    isAndroid
                      ? styles.platformButtonTextAndroid
                      : styles.platformButtonTextIOS,
                  ]}
                >
                  Mensaje
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGoToPlatformDifferences}
                activeOpacity={0.85}
                style={[
                  styles.platformButton,
                  isAndroid
                    ? styles.platformButtonSecondaryAndroid
                    : styles.platformButtonSecondaryIOS,
                ]}
              >
                <Text
                  style={[
                    styles.platformButtonText,
                    isAndroid
                      ? styles.platformButtonTextSecondaryAndroid
                      : styles.platformButtonTextIOS,
                  ]}
                >
                  Diferencias
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Header>
      </View>
    ),
    [
      handleGoToPlatformDifferences,
      handlePlatformInfoPress,
      isAndroid,
      platformName,
    ],
  );

  // Separador entre items
  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1e" />
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

      <TouchableOpacity
        onPress={handleAiOpen}
        activeOpacity={0.9}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Abrir chatbot"
      >
        <Image
          source={{ uri: AI_ROBOT_ICON_URI }}
          style={styles.fabImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Modal
        visible={isAiOpen}
        transparent
        animationType="fade"
        onRequestClose={handleAiClose}
      >
        <Pressable style={styles.aiOverlay} onPress={handleAiClose}>
          <Pressable style={styles.aiSheet} onPress={() => {}}>
            <View style={styles.aiSheetHeader}>
              <View>
                <Text style={styles.aiSheetTitle}>Astro-IA</Text>
                <Text style={styles.aiSheetSubtitle}>
                  {isBotTyping ? "Escribiendo…" : "Historial de la conversación"}
                </Text>
              </View>
              <View style={styles.aiSheetHeaderActions}>
                <TouchableOpacity
                  onPress={handleExportConversation}
                  activeOpacity={0.85}
                  style={styles.exportButton}
                  accessibilityRole="button"
                >
                  <Text style={styles.exportButtonText}>Exportar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAiClose}
                  activeOpacity={0.85}
                  style={styles.aiCloseButton}
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar chatbot"
                >
                  <Text style={styles.aiCloseButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.aiCard,
                styles.aiCardModal,
                isSmallScreen && styles.aiCardSmall,
              ]}
            >
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar en el historial..."
                placeholderTextColor="#7d86a8"
                style={styles.aiSearchInput}
                returnKeyType="search"
              />
              <View style={styles.chatContainer}>
                <FlatList
                  ref={chatListRef}
                  data={filteredMessages}
                  keyExtractor={(item) => item.id}
                  renderItem={renderChatItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.chatContent}
                  onContentSizeChange={() => {
                    chatListRef.current?.scrollToEnd({ animated: true });
                  }}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>
                        No hay mensajes que coincidan con tu búsqueda.
                      </Text>
                    </View>
                  }
                />
                {isBotTyping && (
                  <View style={styles.typingRow}>
                    <View style={styles.avatarBubble}>
                      <Text style={styles.avatarText}>🤖</Text>
                    </View>
                    <View style={styles.typingIndicatorBubble}>
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.aiInputRow}>
                <TextInput
                  value={aiInput}
                  onChangeText={setAiInput}
                  placeholder="Ej: próximo eclipse, recomiéndame un evento…"
                  placeholderTextColor="#7d86a8"
                  style={styles.aiInput}
                  returnKeyType="send"
                  onSubmitEditing={handleAiSend}
                />
                <TouchableOpacity
                  onPress={handleAiSend}
                  activeOpacity={0.85}
                  style={styles.aiButton}
                  accessibilityRole="button"
                >
                  <Text style={styles.aiButtonText}>Enviar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.aiQuickRow}>
                <TouchableOpacity
                  onPress={() => handleAiQuickFill("Recomiéndame un evento")}
                  activeOpacity={0.85}
                  style={styles.aiQuickChip}
                >
                  <Text style={styles.aiQuickChipText}>Recomendar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAiQuickFill("Próximo eclipse")}
                  activeOpacity={0.85}
                  style={styles.aiQuickChip}
                >
                  <Text style={styles.aiQuickChipText}>Eclipse</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAiQuickFill("Eventos en abril")}
                  activeOpacity={0.85}
                  style={styles.aiQuickChip}
                >
                  <Text style={styles.aiQuickChipText}>Abril</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1e",
  },
  listContent: {
    paddingBottom: 96,
  },
  platformRow: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  platformActions: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  platformChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  platformChipAndroid: {
    backgroundColor: "#0f2a1a",
    borderColor: "#2ecc71",
  },
  platformChipIOS: {
    backgroundColor: "#16213e",
    borderColor: "#2d3459",
  },
  platformChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  platformChipTextAndroid: {
    color: "#2ecc71",
  },
  platformChipTextIOS: {
    color: "#a0a0b0",
  },
  platformButton: {
    borderRadius: 12,
    paddingHorizontal: Platform.select({ ios: 12, android: 14 }),
    paddingVertical: Platform.select({ ios: 8, android: 10 }),
  },
  platformButtonAndroid: {
    backgroundColor: "#2ecc71",
    elevation: 3,
  },
  platformButtonIOS: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  platformButtonSecondaryAndroid: {
    backgroundColor: "#16213e",
    borderWidth: 2,
    borderColor: "#2ecc71",
    elevation: 0,
  },
  platformButtonSecondaryIOS: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  platformButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },
  platformButtonTextAndroid: {
    color: "#0f0f1e",
  },
  platformButtonTextIOS: {
    color: "#ffffff",
  },
  platformButtonTextSecondaryAndroid: {
    color: "#2ecc71",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0f0f1e",
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  fabImage: {
    width: 28,
    height: 28,
  },
  aiOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  aiSheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#0f0f1e",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2d3459",
    paddingTop: 10,
  },
  aiSheetHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiSheetHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiSheetSubtitle: {
    color: "#7d86a8",
    fontSize: 12,
    marginTop: 2,
  },
  exportButton: {
    backgroundColor: "#1c2a46",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  exportButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  aiSheetTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  aiCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#16213e",
    borderWidth: 1,
    borderColor: "#2d3459",
    alignItems: "center",
    justifyContent: "center",
  },
  aiCloseButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  aiCard: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#101a33",
    borderWidth: 1,
    borderColor: "#2d3459",
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  aiCardModal: {
    marginTop: 0,
  },
  aiCardSmall: {
    padding: 12,
  },
  aiTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  aiSubtitle: {
    color: "#a0a0b0",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  aiSearchInput: {
    backgroundColor: "#0f1626",
    borderColor: "#2d3459",
    borderWidth: 1,
    borderRadius: 14,
    color: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    marginBottom: 12,
  },
  chatContainer: {
    maxHeight: 320,
    minHeight: 220,
    marginBottom: 12,
  },
  chatContent: {
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  messageRowBot: {
    justifyContent: "flex-start",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  avatarBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#16213e",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  avatarText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: "78%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#2ecc71",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#16213e",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#0f0f1e",
  },
  botMessageText: {
    color: "#ffffff",
  },
  messageMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 6,
  },
  messageTime: {
    color: "#7d86a8",
    fontSize: 11,
  },
  messageStatus: {
    color: "#7d86a8",
    fontSize: 11,
    marginLeft: 8,
  },
  dateDivider: {
    alignSelf: "center",
    backgroundColor: "#16213e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  dateDividerText: {
    color: "#a0a0b0",
    fontSize: 12,
    textTransform: "capitalize",
  },
  emptyState: {
    padding: 22,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#7d86a8",
    fontSize: 13,
    textAlign: "center",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  typingIndicatorBubble: {
    flexDirection: "row",
    backgroundColor: "#16213e",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2ecc71",
    marginHorizontal: 3,
  },
  aiInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiInput: {
    flex: 1,
    backgroundColor: "#0f0f1e",
    borderWidth: 1,
    borderColor: "#2d3459",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    color: "#ffffff",
    fontSize: 13,
  },
  aiButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  aiButtonText: {
    color: "#0f0f1e",
    fontWeight: "900",
    fontSize: 12,
  },
  aiQuickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  aiQuickChip: {
    borderWidth: 1,
    borderColor: "#2d3459",
    backgroundColor: "#16213e",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  aiQuickChipText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  aiAnswerBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#2d3459",
    paddingTop: 10,
  },
  aiQuestionText: {
    color: "#a0a0b0",
    fontSize: 12,
    marginBottom: 6,
  },
  aiAnswerText: {
    color: "#ffffff",
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    height: 4,
  },
});

export default HomeScreen;

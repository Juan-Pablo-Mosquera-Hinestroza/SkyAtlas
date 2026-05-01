import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  KeyboardAvoidingView,
  Modal,
  Pressable,
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

const pad2 = (value) => String(value).padStart(2, "0");

const formatClockTime = (timestamp) => {
  const d = new Date(timestamp);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const isSameDay = (aTs, bTs) => {
  const a = new Date(aTs);
  const b = new Date(bTs);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const getDayLabel = (timestamp) => {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(d.getTime(), today.getTime())) return "Hoy";
  if (isSameDay(d.getTime(), yesterday.getTime())) return "Ayer";

  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  const [aiInput, setAiInput] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const typingTimerRef = useRef(null);
  const chatListRef = useRef(null);
  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: "bot-welcome",
      role: "bot",
      text: 'Escribe algo como: "recomiéndame un evento", "próximo eclipse" o "eventos en abril".',
      timestamp: Date.now(),
      delivery: "received",
    },
  ]);

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

  const handleAiSend = useCallback(() => {
    const question = aiInput.trim();

    if (!question) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "bot",
          text: "Escribe una pregunta (por ejemplo: \"próximo eclipse\").",
          timestamp: Date.now(),
          delivery: "received",
        },
      ]);
      Keyboard.dismiss();
      return;
    }

    const now = Date.now();
    setChatMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        role: "user",
        text: question,
        timestamp: now,
        delivery: "sent",
      },
    ]);
    setAiInput("");
    Keyboard.dismiss();

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setIsAiTyping(true);
    const answer = generateAiAnswer(question);
    const delayMs = Math.min(900, Math.max(350, answer.length * 10));

    typingTimerRef.current = setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "bot",
          text: answer,
          timestamp: Date.now(),
          delivery: "received",
        },
      ]);
      setIsAiTyping(false);
      typingTimerRef.current = null;
    }, delayMs);
  }, [aiInput, generateAiAnswer]);

  const handleAiOpen = useCallback(() => {
    setIsAiOpen(true);
  }, []);

  const handleAiClose = useCallback(() => {
    setIsAiOpen(false);
    Keyboard.dismiss();

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsAiTyping(false);
  }, []);

  useEffect(() => {
    if (!isAiOpen) return;

    const t = setTimeout(() => {
      chatListRef.current?.scrollToEnd?.({ animated: true });
    }, 80);

    return () => clearTimeout(t);
  }, [chatMessages.length, isAiOpen, isAiTyping]);

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

  const renderChatItem = useCallback(
    ({ item, index }) => {
      const prev = index > 0 ? chatMessages[index - 1] : null;
      const showDaySeparator = !prev || !isSameDay(prev.timestamp, item.timestamp);
      const showTimeSeparator =
        !!prev &&
        isSameDay(prev.timestamp, item.timestamp) &&
        Math.abs(item.timestamp - prev.timestamp) >= 30 * 60 * 1000;

      const isUser = item.role === "user";

      return (
        <View>
          {showDaySeparator && (
            <View style={styles.chatSeparatorRow}>
              <View style={styles.chatSeparatorChip}>
                <Text style={styles.chatSeparatorText}>
                  {getDayLabel(item.timestamp)}
                </Text>
              </View>
            </View>
          )}

          {showTimeSeparator && (
            <View style={styles.chatSeparatorRow}>
              <View style={styles.chatSeparatorChip}>
                <Text style={styles.chatSeparatorText}>
                  {formatClockTime(item.timestamp)}
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.chatRow, isUser ? styles.chatRowUser : styles.chatRowBot]}>
            {!isUser ? (
              <View style={styles.chatAvatarWrap}>
                <Image
                  source={{ uri: AI_ROBOT_ICON_URI }}
                  style={styles.chatAvatarImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={styles.chatAvatarSpacer} />
            )}

            <View
              style={[
                styles.chatBubble,
                isUser ? styles.chatBubbleUser : styles.chatBubbleBot,
              ]}
            >
              <Text
                style={[
                  styles.chatBubbleText,
                  isUser ? styles.chatBubbleTextUser : styles.chatBubbleTextBot,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.chatMetaText,
                  isUser ? styles.chatMetaTextUser : styles.chatMetaTextBot,
                ]}
              >
                {formatClockTime(item.timestamp)} • {isUser ? "Enviado" : "Recibido"}
              </Text>
            </View>

            {isUser ? (
              <View style={styles.chatAvatarWrapUser}>
                <Text style={styles.chatAvatarUserText}>Tú</Text>
              </View>
            ) : (
              <View style={styles.chatAvatarSpacer} />
            )}
          </View>
        </View>
      );
    },
    [chatMessages],
  );

  const chatKeyExtractor = useCallback((item) => item.id, []);

  const ChatFooter = useMemo(() => {
    if (!isAiTyping) return <View style={styles.chatFooterSpacer} />;

    return (
      <View style={styles.chatTypingRow}>
        <View style={styles.chatAvatarWrap}>
          <Image
            source={{ uri: AI_ROBOT_ICON_URI }}
            style={styles.chatAvatarImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.chatBubble, styles.chatBubbleBot, styles.chatTypingBubble]}>
          <Text style={[styles.chatBubbleText, styles.chatBubbleTextBot, styles.chatTypingText]}>
            Escribiendo…
          </Text>
          <Text style={[styles.chatMetaText, styles.chatMetaTextBot]}>
            {formatClockTime(Date.now())} • …
          </Text>
        </View>

        <View style={styles.chatAvatarSpacer} />
      </View>
    );
  }, [isAiTyping]);

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
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
              style={styles.chatKav}
            >
              <View style={styles.aiSheetHeader}>
                <View style={styles.aiHeaderLeft}>
                  <Image
                    source={{ uri: AI_ROBOT_ICON_URI }}
                    style={styles.aiHeaderAvatar}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.aiSheetTitle}>Astro-IA</Text>
                    <Text style={styles.aiSheetSubtitle}>
                      {isAiTyping ? "Escribiendo…" : "En línea"}
                    </Text>
                  </View>
                </View>

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

              <View style={styles.chatBody}>
                <FlatList
                  ref={chatListRef}
                  data={chatMessages}
                  renderItem={renderChatItem}
                  keyExtractor={chatKeyExtractor}
                  contentContainerStyle={styles.chatListContent}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={ChatFooter}
                  onScrollBeginDrag={Keyboard.dismiss}
                />

                <View
                  style={[
                    styles.chatComposer,
                    isSmallScreen && styles.chatComposerSmall,
                  ]}
                >
                  <TextInput
                    value={aiInput}
                    onChangeText={setAiInput}
                    placeholder="Mensaje…"
                    placeholderTextColor="#7d86a8"
                    style={styles.chatComposerInput}
                    returnKeyType="send"
                    onSubmitEditing={handleAiSend}
                    editable
                  />
                  <TouchableOpacity
                    onPress={handleAiSend}
                    activeOpacity={0.85}
                    style={styles.chatComposerSend}
                    accessibilityRole="button"
                    accessibilityLabel="Enviar mensaje"
                    disabled={isAiTyping}
                  >
                    <Text style={styles.chatComposerSendText}>Enviar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
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
    gap: 8,
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
    height: "85%",
    maxHeight: "85%",
  },
  aiSheetHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiHeaderAvatar: {
    width: 30,
    height: 30,
  },
  aiSheetTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  aiSheetSubtitle: {
    color: "#a0a0b0",
    fontSize: 11,
    marginTop: 2,
    fontWeight: "700",
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
  chatKav: {
    flex: 1,
  },
  chatBody: {
    flex: 1,
    paddingBottom: 10,
  },
  chatListContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  chatRowBot: {
    justifyContent: "flex-start",
  },
  chatRowUser: {
    justifyContent: "flex-end",
  },
  chatAvatarSpacer: {
    width: 36,
  },
  chatAvatarWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#16213e",
    borderWidth: 1,
    borderColor: "#2d3459",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  chatAvatarImage: {
    width: 18,
    height: 18,
  },
  chatAvatarWrapUser: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2ecc71",
    borderWidth: 1,
    borderColor: "#0f0f1e",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  chatAvatarUserText: {
    color: "#0f0f1e",
    fontSize: 11,
    fontWeight: "900",
  },
  chatBubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chatBubbleBot: {
    backgroundColor: "#101a33",
    borderColor: "#2d3459",
    borderTopLeftRadius: 8,
  },
  chatBubbleUser: {
    backgroundColor: "#2ecc71",
    borderColor: "#0f0f1e",
    borderTopRightRadius: 8,
  },
  chatBubbleText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  chatBubbleTextBot: {
    color: "#ffffff",
  },
  chatBubbleTextUser: {
    color: "#0f0f1e",
  },
  chatMetaText: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.7)",
  },
  chatMetaTextBot: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  chatMetaTextUser: {
    color: "rgba(15, 15, 30, 0.75)",
  },
  chatSeparatorRow: {
    alignItems: "center",
    marginBottom: 6,
  },
  chatSeparatorChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#16213e",
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  chatSeparatorText: {
    color: "#a0a0b0",
    fontSize: 11,
    fontWeight: "800",
  },
  chatComposer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2d3459",
  },
  chatComposerSmall: {
    gap: 8,
  },
  chatComposerInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#0f0f1e",
    borderWidth: 1,
    borderColor: "#2d3459",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    color: "#ffffff",
    fontSize: 13,
  },
  chatComposerSend: {
    height: 40,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chatComposerSendText: {
    color: "#0f0f1e",
    fontWeight: "900",
    fontSize: 12,
  },
  chatFooterSpacer: {
    height: 2,
  },
  chatTypingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  chatTypingBubble: {
    opacity: 0.9,
  },
  chatTypingText: {
    fontStyle: "italic",
  },
  separator: {
    height: 4,
  },
});

export default HomeScreen;

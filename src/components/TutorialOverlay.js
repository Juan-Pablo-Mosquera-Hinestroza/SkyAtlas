import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeSpotlight = ({ spotlight, width, height }) => {
  if (!spotlight) return null;

  const rawTop = Number(spotlight.top ?? 0);
  const rawLeft = Number(spotlight.left ?? 0);
  const rawWidth = Number(spotlight.width ?? 0);
  const rawHeight = Number(spotlight.height ?? 0);

  const safeWidth = clamp(rawWidth, 0, width);
  const safeHeight = clamp(rawHeight, 0, height);
  const safeTop = clamp(rawTop, 0, Math.max(0, height - safeHeight));
  const safeLeft = clamp(rawLeft, 0, Math.max(0, width - safeWidth));

  return {
    top: safeTop,
    left: safeLeft,
    width: safeWidth,
    height: safeHeight,
    borderRadius: Number.isFinite(spotlight.borderRadius)
      ? spotlight.borderRadius
      : 16,
  };
};

const getCardHostStyle = ({ placement, height }) => {
  const verticalPad = Math.max(56, Math.min(120, Math.round(height * 0.14)));

  switch (placement) {
    case "top":
      return { justifyContent: "flex-start", paddingTop: verticalPad };
    case "bottom":
      return { justifyContent: "flex-end", paddingBottom: verticalPad };
    case "topRight":
      return {
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingTop: verticalPad,
      };
    case "bottomRight":
      return {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingBottom: verticalPad,
      };
    case "center":
    default:
      return { justifyContent: "center" };
  }
};

const TutorialOverlay = ({ visible, steps, onComplete, initialStep = 0 }) => {
  const { width, height } = useWindowDimensions();
  const [stepIndex, setStepIndex] = useState(initialStep);
  const wasVisibleRef = useRef(false);

  const cardAnim = useRef(new Animated.Value(0)).current;

  const safeSteps = Array.isArray(steps) ? steps : [];
  const currentStep = safeSteps[stepIndex] || null;

  const spotlight = useMemo(
    () => normalizeSpotlight({ spotlight: currentStep?.spotlight, width, height }),
    [currentStep?.spotlight, height, width],
  );

  const cardWidth = useMemo(() => Math.min(420, Math.max(280, width - 32)), [
    width,
  ]);

  const cardPlacement = currentStep?.cardPlacement || "center";
  const cardHostStyle = useMemo(
    () => getCardHostStyle({ placement: cardPlacement, height }),
    [cardPlacement, height],
  );

  useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      setStepIndex(initialStep);
    }
    wasVisibleRef.current = visible;
  }, [initialStep, visible]);

  useEffect(() => {
    if (!visible) return;

    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [cardAnim, stepIndex, visible]);

  const close = useCallback(
    (reason) => {
      onComplete?.({ reason, stepIndex });
    },
    [onComplete, stepIndex],
  );

  const handleNext = useCallback(() => {
    if (safeSteps.length === 0) {
      close("done");
      return;
    }

    const isLast = stepIndex >= safeSteps.length - 1;
    if (isLast) {
      close("done");
      return;
    }

    setStepIndex((prev) => prev + 1);
  }, [close, safeSteps.length, stepIndex]);

  const handleSkip = useCallback(() => {
    close("skip");
  }, [close]);

  const nextLabel =
    safeSteps.length > 0 && stepIndex >= safeSteps.length - 1
      ? "Listo"
      : "Siguiente";

  const progressLabel =
    safeSteps.length > 0 ? `${stepIndex + 1}/${safeSteps.length}` : "";

  const animatedCardStyle = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  };

  return (
    <Modal
      transparent
      visible={!!visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleSkip}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.blocker}
          onPress={() => {}}
          accessible={false}
        />

        {spotlight ? (
          <View style={styles.spotlightLayer} pointerEvents="none">
            <View style={[styles.overlayPiece, { top: 0, left: 0, right: 0, height: spotlight.top }]} />
            <View
              style={[
                styles.overlayPiece,
                {
                  top: spotlight.top,
                  left: 0,
                  width: spotlight.left,
                  height: spotlight.height,
                },
              ]}
            />
            <View
              style={[
                styles.overlayPiece,
                {
                  top: spotlight.top,
                  left: spotlight.left + spotlight.width,
                  right: 0,
                  height: spotlight.height,
                },
              ]}
            />
            <View
              style={[
                styles.overlayPiece,
                {
                  top: spotlight.top + spotlight.height,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
              ]}
            />

            <View
              style={[
                styles.spotlightBorder,
                {
                  top: spotlight.top,
                  left: spotlight.left,
                  width: spotlight.width,
                  height: spotlight.height,
                  borderRadius: spotlight.borderRadius,
                },
              ]}
            />
          </View>
        ) : (
          <View style={styles.fullOverlay} pointerEvents="none" />
        )}

        <View style={[styles.cardHost, cardHostStyle]}>
          <Animated.View style={[styles.card, { width: cardWidth }, animatedCardStyle]}>
            <View style={styles.cardTopRow}>
              {progressLabel ? (
                <View style={styles.progressChip}>
                  <Text style={styles.progressText}>{progressLabel}</Text>
                </View>
              ) : null}
              <View style={styles.spacer} />
            </View>

            <Text style={styles.title}>{currentStep?.title ?? ""}</Text>
            <Text style={styles.body}>{currentStep?.body ?? ""}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSkip}
                style={styles.secondaryButton}
                accessibilityRole="button"
                accessibilityLabel="Omitir tutorial"
              >
                <Text style={styles.secondaryButtonText}>Omitir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleNext}
                style={styles.primaryButton}
                accessibilityRole="button"
                accessibilityLabel={nextLabel}
              >
                <Text style={styles.primaryButtonText}>{nextLabel}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  blocker: {
    ...StyleSheet.absoluteFillObject,
  },
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.62)",
  },
  spotlightLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayPiece: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.62)",
  },
  spotlightBorder: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(46, 204, 113, 0.95)",
    backgroundColor: "transparent",
  },
  cardHost: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(18, 22, 41, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
      },
      default: {
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
      },
    }),
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#16213e",
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  progressText: {
    color: "#a0a0b0",
    fontSize: 11,
    fontWeight: "800",
  },
  spacer: {
    flex: 1,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  body: {
    color: "#cfd3ff",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  actionsRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryButton: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16213e",
    borderWidth: 1,
    borderColor: "#2d3459",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
  },
  primaryButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ecc71",
    borderWidth: 1,
    borderColor: "#0f0f1e",
  },
  primaryButtonText: {
    color: "#0f0f1e",
    fontWeight: "900",
    fontSize: 12,
  },
});

export default TutorialOverlay;

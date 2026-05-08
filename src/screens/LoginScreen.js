import React, { useContext, useMemo, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	useWindowDimensions,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation, route }) => {
	const { width } = useWindowDimensions();
	const isSmall = width < 380;
	const { loginUser, isBusy } = useContext(AuthContext);
	const scrollRef = useRef(null);
	const passwordRef = useRef(null);
	const cardOffsetY = useRef(0);
	const fieldOffsetY = useRef({ identifier: 0, password: 0 });

	const [form, setForm] = useState({ identifier: "", password: "" });
	const [touched, setTouched] = useState({ identifier: false, password: false });
	const [serverErrors, setServerErrors] = useState({
		identifier: "",
		password: "",
	});
	const [feedback, setFeedback] = useState({ type: "", message: "" });

	const identifierOk = useMemo(() => form.identifier.trim().length > 0, [
		form.identifier,
	]);
	const passwordOk = useMemo(() => form.password.length > 0, [form.password]);
	const canSubmit = identifierOk && passwordOk && !isBusy;

	const identifierError = useMemo(() => {
		if (!touched.identifier && !serverErrors.identifier) return "";
		if (!form.identifier.trim()) return "El correo o usuario es obligatorio.";
		return serverErrors.identifier || "";
	}, [form.identifier, touched.identifier, serverErrors.identifier]);

	const passwordError = useMemo(() => {
		if (!touched.password && !serverErrors.password) return "";
		if (!form.password) return "La contraseña es obligatoria.";
		return serverErrors.password || "";
	}, [form.password, touched.password, serverErrors.password]);

	const scrollToField = (field) => {
		const cardY = cardOffsetY.current ?? 0;
		const fieldY = fieldOffsetY.current?.[field] ?? 0;
		const targetY = Math.max(0, cardY + fieldY - 24);
		scrollRef.current?.scrollTo({ y: targetY, animated: true });
	};

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setServerErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const handleSubmit = async () => {
		setFeedback({ type: "", message: "" });
		setTouched({ identifier: true, password: true });
		setServerErrors({ identifier: "", password: "" });

		if (!identifierOk || !passwordOk) {
			setFeedback({ type: "error", message: "Revisa los campos marcados." });
			return;
		}

		const result = await loginUser({
			identifier: form.identifier,
			password: form.password,
		});

		if (!result.ok) {
			if (result.code === "USER_NOT_FOUND") {
				setServerErrors({ identifier: result.message, password: "" });
				return;
			}

			if (result.code === "WRONG_PASSWORD") {
				setServerErrors({ identifier: "", password: result.message });
				return;
			}

			setFeedback({ type: "error", message: result.message });
			return;
		}

		setFeedback({ type: "success", message: "Sesión iniciada." });

		if (route?.params?.redirectTo) {
			navigation.reset({
				index: 0,
				routes: [
					{
						name: route.params.redirectTo,
						params: route.params.eventPayload,
					},
				],
			});
			return;
		}

		navigation.reset({ index: 0, routes: [{ name: "Home" }] });
	};

	return (
		<KeyboardAvoidingView
			style={styles.flex}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<StatusBar barStyle="light-content" backgroundColor="#0f0f1e" />
			<ScrollView
				ref={scrollRef}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode={Platform.OS === "ios" ? "on-drag" : "none"}
				automaticallyAdjustKeyboardInsets
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.heroGlow} />
				<View style={styles.heroGlowSecondary} />

				<View
					style={[styles.card, isSmall && styles.cardSmall]}
					onLayout={(event) => {
						cardOffsetY.current = event.nativeEvent.layout.y;
					}}
				>
					<Text style={[styles.title, isSmall && styles.titleSmall]}>
						Bienvenido de vuelta
					</Text>
					<Text style={[styles.subtitle, isSmall && styles.subtitleSmall]}>
						Ingresa con tu correo o usuario para continuar.
					</Text>

					<View
						style={styles.inputGroup}
						onLayout={(event) => {
							fieldOffsetY.current.identifier = event.nativeEvent.layout.y;
						}}
					>
						<Text style={styles.label}>Correo o usuario</Text>
						<TextInput
							style={[styles.input, identifierError && styles.inputError]}
							placeholder="correo@ejemplo.com"
							placeholderTextColor="#7f86a8"
							autoCapitalize="none"
							autoCorrect={false}
							value={form.identifier}
							onChangeText={(value) => handleChange("identifier", value)}
							onFocus={() => scrollToField("identifier")}
							onBlur={() =>
								setTouched((prev) => ({ ...prev, identifier: true }))
							}
							returnKeyType="next"
							onSubmitEditing={() => passwordRef.current?.focus()}
						/>
						{identifierError ? (
							<Text style={styles.fieldError}>{identifierError}</Text>
						) : null}
					</View>

					<View
						style={styles.inputGroup}
						onLayout={(event) => {
							fieldOffsetY.current.password = event.nativeEvent.layout.y;
						}}
					>
						<Text style={styles.label}>Contraseña</Text>
						<TextInput
							ref={passwordRef}
							style={[styles.input, passwordError && styles.inputError]}
							placeholder="Tu contraseña"
							placeholderTextColor="#7f86a8"
							secureTextEntry
							value={form.password}
							onChangeText={(value) => handleChange("password", value)}
							onFocus={() => scrollToField("password")}
							onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
							returnKeyType="done"
							onSubmitEditing={handleSubmit}
						/>
						{passwordError ? (
							<Text style={styles.fieldError}>{passwordError}</Text>
						) : null}
					</View>

					{feedback.message ? (
						<Text
							style={[
								styles.feedback,
								feedback.type === "error" && styles.feedbackError,
								feedback.type === "success" && styles.feedbackSuccess,
							]}
						>
							{feedback.message}
						</Text>
					) : null}

					<TouchableOpacity
						activeOpacity={0.85}
						onPress={handleSubmit}
						style={[
							styles.submitButton,
							(!canSubmit || isBusy) && styles.submitButtonDisabled,
						]}
						disabled={isBusy}
					>
						<View style={styles.submitContent}>
							{isBusy ? (
								<ActivityIndicator
									size="small"
									color="#ffffff"
									style={styles.submitSpinner}
								/>
							) : null}
							<Text style={styles.submitText}>
								{isBusy ? "Ingresando..." : "Iniciar sesión"}
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => navigation.navigate("Register")}
						style={styles.secondaryAction}
					>
						<Text style={styles.secondaryText}>
							No tengo cuenta. Registrarme
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	flex: {
		flex: 1,
		backgroundColor: "#0f0f1e",
	},
	scrollContent: {
		flexGrow: 1,
		padding: 20,
		paddingBottom: 32,
		justifyContent: "center",
	},
	heroGlow: {
		position: "absolute",
		width: 240,
		height: 240,
		borderRadius: 120,
		backgroundColor: "rgba(102, 94, 255, 0.22)",
		top: -90,
		left: -60,
	},
	heroGlowSecondary: {
		position: "absolute",
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: "rgba(46, 204, 113, 0.18)",
		bottom: -70,
		right: -40,
	},
	card: {
		backgroundColor: "rgba(18, 22, 41, 0.92)",
		borderRadius: 24,
		padding: 22,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
	},
	cardSmall: {
		padding: 18,
		borderRadius: 20,
	},
	title: {
		color: "#ffffff",
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 6,
	},
	titleSmall: {
		fontSize: 22,
	},
	subtitle: {
		color: "#a0a5c2",
		fontSize: 14,
		marginBottom: 18,
	},
	subtitleSmall: {
		fontSize: 13,
	},
	inputGroup: {
		marginBottom: 14,
	},
	label: {
		color: "#cfd3ff",
		fontSize: 12,
		fontWeight: "600",
		marginBottom: 6,
	},
	input: {
		backgroundColor: "rgba(255, 255, 255, 0.06)",
		borderRadius: 16,
		paddingHorizontal: 14,
		paddingVertical: 10,
		color: "#ffffff",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
	},
	inputError: {
		borderColor: "#ff7a7a",
	},
	fieldError: {
		color: "#ff7a7a",
		fontSize: 11,
		marginTop: 6,
	},
	feedback: {
		marginTop: 6,
		marginBottom: 8,
		fontSize: 12,
	},
	feedbackError: {
		color: "#ff7a7a",
	},
	feedbackSuccess: {
		color: "#6ee7b7",
	},
	submitButton: {
		marginTop: 6,
		backgroundColor: "#6e67ff",
		borderRadius: 18,
		paddingVertical: 12,
		alignItems: "center",
		shadowColor: "#6e67ff",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 6,
	},
	submitButtonDisabled: {
		opacity: 0.6,
	},
	submitText: {
		color: "#ffffff",
		fontWeight: "700",
	},
	submitContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	submitSpinner: {
		marginRight: 8,
	},
	secondaryAction: {
		marginTop: 14,
		alignItems: "center",
	},
	secondaryText: {
		color: "#cfd3ff",
		fontSize: 12,
	},
});

export default LoginScreen;

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

const isEmailValid = (value) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const MIN_PASSWORD_LENGTH = 8;

const getPasswordChecks = (value) => {
	const password = typeof value === "string" ? value : "";
	return {
		length: password.length >= MIN_PASSWORD_LENGTH,
		lowercase: /[a-z]/.test(password),
		uppercase: /[A-Z]/.test(password),
		number: /\d/.test(password),
		symbol: /[^A-Za-z0-9]/.test(password),
	};
};

const getPasswordFirstError = (value) => {
	const password = typeof value === "string" ? value : "";
	if (!password) return "La contraseña es obligatoria.";
	if (password.length < MIN_PASSWORD_LENGTH) {
		return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
	}
	if (!/[a-z]/.test(password)) return "Incluye al menos 1 letra minúscula.";
	if (!/[A-Z]/.test(password)) return "Incluye al menos 1 letra mayúscula.";
	if (!/\d/.test(password)) return "Incluye al menos 1 número.";
	if (!/[^A-Za-z0-9]/.test(password)) {
		return "Incluye al menos 1 símbolo (ej. !@#$).";
	}
	return "";
};

const getRegisterErrors = (form) => {
	const nextErrors = {
		name: "",
		username: "",
		email: "",
		password: "",
		confirm: "",
	};

	const name = form.name.trim();
	if (!name) nextErrors.name = "El nombre es obligatorio.";
	else if (name.length < 2) nextErrors.name = "El nombre debe tener al menos 2 caracteres.";

	const username = form.username.trim();
	if (!username) nextErrors.username = "El usuario es obligatorio.";
	else if (username.length < 3)
		nextErrors.username = "El usuario debe tener al menos 3 caracteres.";

	const email = form.email.trim();
	if (!email) nextErrors.email = "El correo es obligatorio.";
	else if (!isEmailValid(email)) nextErrors.email = "El correo no es válido.";

	nextErrors.password = getPasswordFirstError(form.password);

	if (!form.confirm) nextErrors.confirm = "Confirma tu contraseña.";
	else if (form.confirm !== form.password)
		nextErrors.confirm = "Las contraseñas no coinciden.";

	return nextErrors;
};

const RegisterScreen = ({ navigation }) => {
	const { width } = useWindowDimensions();
	const isSmall = width < 380;
	const { registerUser, isBusy } = useContext(AuthContext);
	const scrollRef = useRef(null);
	const usernameRef = useRef(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const confirmRef = useRef(null);
	const cardOffsetY = useRef(0);
	const fieldOffsetY = useRef({
		name: 0,
		username: 0,
		email: 0,
		password: 0,
		confirm: 0,
	});

	const [form, setForm] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		confirm: "",
	});
	const [touched, setTouched] = useState({
		name: false,
		username: false,
		email: false,
		password: false,
		confirm: false,
	});
	const [feedback, setFeedback] = useState({ type: "", message: "" });

	const errors = useMemo(() => getRegisterErrors(form), [form]);
	const passwordChecks = useMemo(
		() => getPasswordChecks(form.password),
		[form.password],
	);
	const passwordDirty = form.password.length > 0;
	const canSubmit =
		Object.values(errors).every((message) => !message) && !isBusy;

	const scrollToField = (field) => {
		const cardY = cardOffsetY.current ?? 0;
		const fieldY = fieldOffsetY.current?.[field] ?? 0;
		const targetY = Math.max(0, cardY + fieldY - 24);
		scrollRef.current?.scrollTo({ y: targetY, animated: true });
	};

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		setFeedback({ type: "", message: "" });
		setTouched({
			name: true,
			username: true,
			email: true,
			password: true,
			confirm: true,
		});

		const submitErrors = getRegisterErrors(form);
		const hasErrors = Object.values(submitErrors).some((message) => !!message);
		if (hasErrors) {
			setFeedback({ type: "error", message: "Revisa los campos marcados." });
			return;
		}

		const result = await registerUser({
			name: form.name,
			username: form.username,
			email: form.email,
			password: form.password,
		});

		if (!result.ok) {
			setFeedback({ type: "error", message: result.message });
			return;
		}

		setFeedback({ type: "success", message: "Cuenta creada. Sesión iniciada." });
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
						Crear cuenta
					</Text>
					<Text style={[styles.subtitle, isSmall && styles.subtitleSmall]}>
						Registra tu perfil para guardar eventos y tu progreso.
					</Text>

					<View
						style={styles.inputGroup}
						onLayout={(event) => {
							fieldOffsetY.current.name = event.nativeEvent.layout.y;
						}}
					>
						<Text style={styles.label}>Nombre</Text>
						<TextInput
							style={[styles.input, touched.name && errors.name && styles.inputError]}
							placeholder="Tu nombre"
							placeholderTextColor="#7f86a8"
							value={form.name}
							onChangeText={(value) => handleChange("name", value)}
							onFocus={() => scrollToField("name")}
							onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
							returnKeyType="next"
							onSubmitEditing={() => usernameRef.current?.focus()}
						/>
						{touched.name && errors.name ? (
							<Text style={styles.fieldError}>{errors.name}</Text>
						) : null}
					</View>

					<View
						style={styles.inputGroup}
						onLayout={(event) => {
							fieldOffsetY.current.username = event.nativeEvent.layout.y;
						}}
					>
						<Text style={styles.label}>Usuario</Text>
						<TextInput
							ref={usernameRef}
							style={[
								styles.input,
								touched.username && errors.username && styles.inputError,
							]}
							placeholder="username"
							placeholderTextColor="#7f86a8"
							autoCapitalize="none"
							autoCorrect={false}
							value={form.username}
							onChangeText={(value) => handleChange("username", value)}
							onFocus={() => scrollToField("username")}
							onBlur={() =>
								setTouched((prev) => ({ ...prev, username: true }))
							}
							returnKeyType="next"
							onSubmitEditing={() => emailRef.current?.focus()}
						/>
						{touched.username && errors.username ? (
							<Text style={styles.fieldError}>{errors.username}</Text>
						) : null}
					</View>

					<View
						style={styles.inputGroup}
						onLayout={(event) => {
							fieldOffsetY.current.email = event.nativeEvent.layout.y;
						}}
					>
						<Text style={styles.label}>Correo</Text>
						<TextInput
							ref={emailRef}
							style={[styles.input, touched.email && errors.email && styles.inputError]}
							placeholder="correo@ejemplo.com"
							placeholderTextColor="#7f86a8"
							autoCapitalize="none"
							autoCorrect={false}
							keyboardType="email-address"
							value={form.email}
							onChangeText={(value) => handleChange("email", value)}
							onFocus={() => scrollToField("email")}
							onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
							returnKeyType="next"
							onSubmitEditing={() => passwordRef.current?.focus()}
						/>
						{touched.email && errors.email ? (
							<Text style={styles.fieldError}>{errors.email}</Text>
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
							style={[
								styles.input,
								touched.password && errors.password && styles.inputError,
							]}
							placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
							placeholderTextColor="#7f86a8"
							secureTextEntry
							value={form.password}
							onChangeText={(value) => handleChange("password", value)}
							onFocus={() => scrollToField("password")}
							onBlur={() =>
								setTouched((prev) => ({ ...prev, password: true }))
							}
							returnKeyType="next"
							onSubmitEditing={() => confirmRef.current?.focus()}
						/>
						<View style={styles.requirementsBox}>
							<View style={styles.requirementRow}>
								<Text
									style={[
										styles.requirementIcon,
										passwordChecks.length
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									{passwordChecks.length ? "✓" : passwordDirty ? "✕" : "•"}
								</Text>
								<Text
									style={[
										styles.requirementText,
										passwordChecks.length
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									{`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
								</Text>
							</View>
							<View style={styles.requirementRow}>
								<Text
									style={[
										styles.requirementIcon,
										passwordChecks.uppercase
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									{passwordChecks.uppercase ? "✓" : passwordDirty ? "✕" : "•"}
								</Text>
								<Text
									style={[
										styles.requirementText,
										passwordChecks.uppercase
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									1 mayúscula (A-Z)
								</Text>
							</View>
							<View style={styles.requirementRow}>
								<Text
									style={[
										styles.requirementIcon,
										passwordChecks.lowercase
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									{passwordChecks.lowercase ? "✓" : passwordDirty ? "✕" : "•"}
								</Text>
								<Text
									style={[
										styles.requirementText,
										passwordChecks.lowercase
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									1 minúscula (a-z)
								</Text>
							</View>
							<View style={styles.requirementRow}>
								<Text
									style={[
										styles.requirementIcon,
										passwordChecks.number
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									{passwordChecks.number ? "✓" : passwordDirty ? "✕" : "•"}
								</Text>
								<Text
									style={[
										styles.requirementText,
										passwordChecks.number
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									1 número (0-9)
								</Text>
							</View>
							<View style={styles.requirementRow}>
								<Text
									style={[
										styles.requirementIcon,
										passwordChecks.symbol
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									{passwordChecks.symbol ? "✓" : passwordDirty ? "✕" : "•"}
								</Text>
								<Text
									style={[
										styles.requirementText,
										passwordChecks.symbol
											? styles.requirementOk
											: passwordDirty
												? styles.requirementBad
												: styles.requirementNeutral,
									]}
								>
									1 símbolo (!@#$)
								</Text>
							</View>
						</View>
						{touched.password && errors.password ? (
							<Text style={styles.fieldError}>{errors.password}</Text>
						) : null}
					</View>

					<View
						style={styles.inputGroup}
						onLayout={(event) => {
							fieldOffsetY.current.confirm = event.nativeEvent.layout.y;
						}}
					>
						<Text style={styles.label}>Confirmar contraseña</Text>
						<TextInput
							ref={confirmRef}
							style={[
								styles.input,
								touched.confirm && errors.confirm && styles.inputError,
							]}
							placeholder="Repite tu contraseña"
							placeholderTextColor="#7f86a8"
							secureTextEntry
							value={form.confirm}
							onChangeText={(value) => handleChange("confirm", value)}
							onFocus={() => scrollToField("confirm")}
							onBlur={() => setTouched((prev) => ({ ...prev, confirm: true }))}
							returnKeyType="done"
							onSubmitEditing={handleSubmit}
						/>
						{touched.confirm && errors.confirm ? (
							<Text style={styles.fieldError}>{errors.confirm}</Text>
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
									color="#0f0f1e"
									style={styles.submitSpinner}
								/>
							) : null}
							<Text style={styles.submitText}>
								{isBusy ? "Creando..." : "Registrarme"}
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => navigation.navigate("Login")}
						style={styles.secondaryAction}
					>
						<Text style={styles.secondaryText}>
							Ya tengo cuenta. Iniciar sesion
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
		backgroundColor: "rgba(102, 94, 255, 0.25)",
		top: -80,
		right: -60,
	},
	heroGlowSecondary: {
		position: "absolute",
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: "rgba(46, 204, 113, 0.18)",
		bottom: -70,
		left: -40,
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
	requirementsBox: {
		marginTop: 10,
		padding: 12,
		borderRadius: 16,
		backgroundColor: "rgba(255, 255, 255, 0.06)",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
	},
	requirementRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
	},
	requirementIcon: {
		width: 18,
		marginRight: 8,
		fontSize: 12,
		fontWeight: "700",
		textAlign: "center",
	},
	requirementText: {
		fontSize: 11,
		flexShrink: 1,
	},
	requirementOk: {
		color: "#6ee7b7",
	},
	requirementBad: {
		color: "#ff7a7a",
	},
	requirementNeutral: {
		color: "#a0a5c2",
	},
	helperText: {
		color: "#f3c969",
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
		backgroundColor: "#2ecc71",
		borderRadius: 18,
		paddingVertical: 12,
		alignItems: "center",
		shadowColor: "#2ecc71",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 6,
	},
	submitButtonDisabled: {
		opacity: 0.6,
	},
	submitText: {
		color: "#0f0f1e",
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

export default RegisterScreen;

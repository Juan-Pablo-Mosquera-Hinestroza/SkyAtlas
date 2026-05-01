import React, { useContext, useMemo, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	useWindowDimensions,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const isEmailValid = (value) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const getPasswordStrength = (value) => {
	if (value.length < 6) return "Debil";
	if (/[A-Z]/.test(value) && /\d/.test(value) && value.length >= 8) return "Fuerte";
	return "Media";
};

const RegisterScreen = ({ navigation }) => {
	const { width } = useWindowDimensions();
	const isSmall = width < 380;
	const { registerUser, isBusy } = useContext(AuthContext);

	const [form, setForm] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		confirm: "",
	});
	const [feedback, setFeedback] = useState({ type: "", message: "" });

	const emailOk = useMemo(() => isEmailValid(form.email), [form.email]);
	const passwordStrength = useMemo(
		() => getPasswordStrength(form.password),
		[form.password],
	);
	const passwordOk =
		form.password.length >= 6 && /[A-Z]/.test(form.password) && /\d/.test(form.password);
	const confirmOk = form.password && form.password === form.confirm;
	const nameOk = form.name.trim().length >= 2;
	const usernameOk = form.username.trim().length >= 3;

	const canSubmit =
		nameOk && usernameOk && emailOk && passwordOk && confirmOk && !isBusy;

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		setFeedback({ type: "", message: "" });

		if (!canSubmit) {
			setFeedback({ type: "error", message: "Revisa los datos del formulario." });
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

		setFeedback({ type: "success", message: "Cuenta creada. Sesion iniciada." });
		navigation.reset({ index: 0, routes: [{ name: "Home" }] });
	};

	return (
		<KeyboardAvoidingView
			style={styles.flex}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<StatusBar barStyle="light-content" backgroundColor="#0f0f1e" />
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.heroGlow} />
				<View style={styles.heroGlowSecondary} />

				<View style={[styles.card, isSmall && styles.cardSmall]}>
					<Text style={[styles.title, isSmall && styles.titleSmall]}>
						Crear cuenta
					</Text>
					<Text style={[styles.subtitle, isSmall && styles.subtitleSmall]}>
						Registra tu perfil para guardar eventos y tu progreso.
					</Text>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Nombre</Text>
						<TextInput
							style={styles.input}
							placeholder="Tu nombre"
							placeholderTextColor="#7f86a8"
							value={form.name}
							onChangeText={(value) => handleChange("name", value)}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Usuario</Text>
						<TextInput
							style={styles.input}
							placeholder="username"
							placeholderTextColor="#7f86a8"
							autoCapitalize="none"
							value={form.username}
							onChangeText={(value) => handleChange("username", value)}
						/>
						{!usernameOk && form.username.length > 0 ? (
							<Text style={styles.helperText}>Minimo 3 caracteres.</Text>
						) : null}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Correo</Text>
						<TextInput
							style={styles.input}
							placeholder="correo@ejemplo.com"
							placeholderTextColor="#7f86a8"
							autoCapitalize="none"
							keyboardType="email-address"
							value={form.email}
							onChangeText={(value) => handleChange("email", value)}
						/>
						{form.email.length > 0 && !emailOk ? (
							<Text style={styles.helperText}>Correo no valido.</Text>
						) : null}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Contraseña</Text>
						<TextInput
							style={styles.input}
							placeholder="Minimo 6, 1 mayuscula y 1 numero"
							placeholderTextColor="#7f86a8"
							secureTextEntry
							value={form.password}
							onChangeText={(value) => handleChange("password", value)}
						/>
						<Text style={styles.helperText}>
							Requisitos: 6+ caracteres, 1 mayuscula y 1 numero. Fuerza: {passwordStrength}
						</Text>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Confirmar contraseña</Text>
						<TextInput
							style={styles.input}
							placeholder="Repite tu contraseña"
							placeholderTextColor="#7f86a8"
							secureTextEntry
							value={form.confirm}
							onChangeText={(value) => handleChange("confirm", value)}
						/>
						{form.confirm.length > 0 && !confirmOk ? (
							<Text style={styles.helperText}>No coincide la contraseña.</Text>
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
						style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
						disabled={!canSubmit}
					>
						<Text style={styles.submitText}>
							{isBusy ? "Creando..." : "Registrarme"}
						</Text>
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

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

const LoginScreen = ({ navigation }) => {
	const { width } = useWindowDimensions();
	const isSmall = width < 380;
	const { loginUser, isBusy } = useContext(AuthContext);

	const [form, setForm] = useState({ identifier: "", password: "" });
	const [feedback, setFeedback] = useState({ type: "", message: "" });

	const identifierOk = useMemo(() => form.identifier.trim().length > 0, [
		form.identifier,
	]);
	const passwordOk = useMemo(() => form.password.length >= 6, [form.password]);
	const canSubmit = identifierOk && passwordOk && !isBusy;

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		setFeedback({ type: "", message: "" });

		if (!canSubmit) {
			setFeedback({ type: "error", message: "Completa tus credenciales." });
			return;
		}

		const result = await loginUser({
			identifier: form.identifier,
			password: form.password,
		});

		if (!result.ok) {
			setFeedback({ type: "error", message: result.message });
			return;
		}

		setFeedback({ type: "success", message: "Sesion iniciada." });
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
						Bienvenido de vuelta
					</Text>
					<Text style={[styles.subtitle, isSmall && styles.subtitleSmall]}>
						Ingresa con tu correo o usuario para continuar.
					</Text>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Correo o usuario</Text>
						<TextInput
							style={styles.input}
							placeholder="correo@ejemplo.com"
							placeholderTextColor="#7f86a8"
							autoCapitalize="none"
							value={form.identifier}
							onChangeText={(value) => handleChange("identifier", value)}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Contraseña</Text>
						<TextInput
							style={styles.input}
							placeholder="Tu contraseña"
							placeholderTextColor="#7f86a8"
							secureTextEntry
							value={form.password}
							onChangeText={(value) => handleChange("password", value)}
						/>
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
							{isBusy ? "Ingresando..." : "Iniciar sesion"}
						</Text>
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

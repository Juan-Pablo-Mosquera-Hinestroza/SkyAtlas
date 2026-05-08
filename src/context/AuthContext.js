import React, { createContext, useCallback, useMemo, useState } from "react";
import {
  createUser,
  findUserByEmailOrUsername,
  loadUsers,
  saveUsers,
} from "../utils/userStore";

export const AuthContext = createContext({
  currentUser: null,
  sessionToken: null,
  isBusy: false,
  registerUser: async () => ({ ok: false, message: "" }),
  loginUser: async () => ({ ok: false, message: "" }),
  logoutUser: () => {},
  updateCurrentUser: () => {},
});

const createSessionToken = () =>
  `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const updateCurrentUser = useCallback((nextUser) => {
    setCurrentUser(nextUser);
  }, []);

  const registerUser = useCallback(
    async ({ name, email, username, password }) => {
      setIsBusy(true);
      try {
        const users = await loadUsers();
        const existing = findUserByEmailOrUsername(users, email) ||
          findUserByEmailOrUsername(users, username);

        if (existing) {
          return { ok: false, message: "Ese correo o usuario ya existe." };
        }

        const newUser = createUser({ name, email, username, password });
        await saveUsers([...users, newUser]);

        setCurrentUser(newUser);
        setSessionToken(createSessionToken());

        return { ok: true, user: newUser };
      } catch (error) {
        return { ok: false, message: "No se pudo registrar. Intenta de nuevo." };
      } finally {
        setIsBusy(false);
      }
    },
    [],
  );

  const loginUser = useCallback(async ({ identifier, password }) => {
    setIsBusy(true);
    try {
      const normalizedIdentifier =
        typeof identifier === "string" ? identifier.trim() : "";
      const normalizedPassword = typeof password === "string" ? password : "";

      if (!normalizedIdentifier || !normalizedPassword) {
        return {
          ok: false,
          code: "EMPTY_FIELDS",
          message: "Completa los campos requeridos.",
        };
      }

      const users = await loadUsers();

      const user = findUserByEmailOrUsername(users, normalizedIdentifier);

      if (!user) {
        return { ok: false, code: "USER_NOT_FOUND", message: "Usuario no encontrado." };
      }

      if (user.password !== normalizedPassword) {
        return {
          ok: false,
          code: "WRONG_PASSWORD",
          message: "Contraseña incorrecta.",
        };
      }

      setCurrentUser(user);
      setSessionToken(createSessionToken());
      return { ok: true, user };
    } catch (error) {
      return { ok: false, message: "No se pudo iniciar sesión." };
    } finally {
      setIsBusy(false);
    }
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    setSessionToken(null);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      sessionToken,
      isBusy,
      registerUser,
      loginUser,
      logoutUser,
      updateCurrentUser,
    }),
    [
      currentUser,
      sessionToken,
      isBusy,
      registerUser,
      loginUser,
      logoutUser,
      updateCurrentUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

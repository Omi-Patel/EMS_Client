import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const getDecodedToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

export const getUser = () => {
  const decoded = getDecodedToken();
  if (!decoded) return null;

  return {
    userId: decoded.userId,
    name: decoded.name,
    email: decoded.email,
    isAdmin: decoded.isAdmin,
  };
};

export const isAuthenticated = (): boolean => {
  return isTokenValid();
};

export const isAdmin = (): boolean => {
  const decoded = getDecodedToken();
  return decoded?.isAdmin ?? false;
};

import type {
  LoginInput,
  UserRegistration,
  UserResponse,
} from "@/schema/user-schema";
import axios from "axios";

export function getBackendUrl() {
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return backendUrl;
}

// Base API URL
const API_BASE_URL = `${getBackendUrl()}/api`;

export async function createUser(
  userInput: UserRegistration
): Promise<UserResponse> {
  try {
    const response = await axios.post<UserResponse>(
      `${API_BASE_URL}/auth/register`,
      userInput,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
}

export async function loginUser(loginInput: LoginInput): Promise<UserResponse> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      loginInput,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to login user");
  }
}

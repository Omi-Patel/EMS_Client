import type {
  LoginInput,
  UserRegistration,
  UserResponse,
} from "@/schema/user-schema";
import type {
  ListServiceResponse,
  ServiceRegistration,
  ServiceResponse,
} from "@/schema/service-schema";
import axios from "axios";
import { getToken } from "@/lib/auth";

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

// services actions

export async function createService(
  serviceInput: ServiceRegistration
): Promise<ServiceResponse> {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_BASE_URL}/services`,
      serviceInput,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create service");
  }
}

export async function getServices(): Promise<ListServiceResponse> {
  try {
    const response = await axios.get<ListServiceResponse>(
      `${API_BASE_URL}/services`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to get services");
  }
}

export async function getServiceById(id: string): Promise<ServiceResponse> {
  try {
    const response = await axios.get<ServiceResponse>(
      `${API_BASE_URL}/services/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to get service by id");
  }
}

export async function updateService(
  id: string,
  serviceInput: ServiceRegistration
): Promise<ServiceResponse> {
  try {
    const token = getToken();
    const response = await axios.put<ServiceResponse>(
      `${API_BASE_URL}/services/${id}`,
      serviceInput,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update service");
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    const token = getToken();
    await axios.delete(`${API_BASE_URL}/services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error("Failed to delete service");
  }
}

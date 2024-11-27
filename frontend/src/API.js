import axios from "axios";
import { toast } from "react-hot-toast";

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired! Please Login Again.", 2);
      await timeout(2000);
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

class API {
  constructor() {}

  static async login(data) {
    try {
      const res = await api.post("/api/auth/login", data);
      return res.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async signup(data) {
    try {
      const res = await api.post("/api/auth/signup", data);
      return res.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async sendToken(){
    try {
      const res = await api.get("/api/auth/cookie-validate");
      return res.data;
    } catch (error) {
      
    }
  }

  static async logout() {
    try {
      const res = await api.post("/api/auth/logout");
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async verifyOtp(data) {
    try {
      const res = await api.post("/api/auth/validate-otp", data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async createRole(data) {
    try {
      const res = await api.post("/api/roles", data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async assignRoles(data) {
    try {
      const res = await api.post("/api/roles/assign-roles", data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getCurrUsersRoles() {
    try {
      const res = await api.get("/api/roles/");
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getRoleById(roleId) {
    try {
      const res = await api.get(`/api/roles/${roleId}`);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async deleteRolebyId(roleId) {
    try {
      const res = await api.delete(`/api/roles/${roleId}`);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async createUser(data) {
    try {
      const res = await api.post("/api/users/", data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getIAMUsers() {
    try {
      const res = await api.get("/api/users/");
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getAuser(iamUsername) {
    try {
      const res = await api.get(`/api/users/${iamUsername}`);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async toggleStatus(iamUserId, data) {
    try {
      const res = await api.post(`/api/users/toggle-status/${iamUserId}`, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async deleteUserbyId(iamUserId) {
    try {
      const res = await api.delete(`/api/users/${iamUserId}`);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async removePermission(data) {
    try {
      const res = await api.post("/api/roles/remove-permission", data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async addPermission(data) {
    try {
      const res = await api.post("/api/roles/add-permission", data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getPermissions() {
    try {
      const res = await api.get("/api/permissions/");
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getPermissionById(permissionId) {
    try {
      const res = await api.get(`/api/permissions/${permissionId}`);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getResources() {
    try {
      const res = await api.get("/api/resources/");
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }

  static async getResourcebyId(resourceName) {
    try {
      const res = await api.get(`/api/resources/${resourceName}`);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(error);
      toast.error(errorMessage, 2);
      throw error;
    }
  }
}

export default API;

import api from "./api";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      if (response.data && response.data.user) {
        localStorage.setItem("authToken", response.data.token || "demo-token");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error("Resposta da API em formato inesperado");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao fazer login";
      throw new Error(errorMessage);
    }
  },

  async updateProfile(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao atualizar perfil";
      throw new Error(errorMessage);
    }
  },

  async deleteAccount(userId) {
    try {
      await api.delete(`/users/${userId}`);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao excluir conta";
      throw new Error(errorMessage);
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/users", userData);

      if (response.data && (response.data._id || response.data.id)) {
        console.log("Registro bem-sucedido:", response.data);
        return response.data;
      } else {
        throw new Error("Resposta da API em formato inesperado");
      }
    } catch (error) {
      console.error("Erro no registro:", error);

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.messages;
        throw new Error(
          validationErrors.password?.[0] ||
            validationErrors.email?.[0] ||
            "Erro de validação nos dados"
        );
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao criar conta";
      throw new Error(errorMessage);
    }
  },

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },
};

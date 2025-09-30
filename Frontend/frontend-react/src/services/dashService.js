import api from "./api";

export const caseService = {
  async getAllCases() {
    try {
      const response = await api.get("/case");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erro ao buscar casos");
    }
  },
};

import api from "./api";

export const notificationService = {
  async getNotifications(userId) {
    try {
      const url = `/notifications?user_id=${userId}`;
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        "";

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.get(url, {
        headers,
        timeout: 15000,
      });

      console.debug("[notificationService] Resposta recebida:", response.data);

      const data = response.data;
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.notifications)) return data.notifications;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.data?.notifications))
        return data.data.notifications;
      return [];
    } catch (error) {
      console.error("Erro ao buscar notificações (service):", error);

      return [];
    }
  },

  getMockNotifications() {
    return [
      {
        id: 1,
        message: "Viveiro A apresenta umidade abaixo do ideal",
        type: "alerta",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        message: "Novo caso de antracnose detectado no Viveiro B",
        type: "critico",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        message: "Viveiro C está com condições ideais",
        type: "info",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  },

  async markAsRead(notificationId) {
    try {
      const response = await api.patch(
        `/notifications/${notificationId}`,
        {},
        {
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      await api.delete(`/notifications/${notificationId}`, {
        timeout: 10000,
      });
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
      throw error;
    }
  },
};

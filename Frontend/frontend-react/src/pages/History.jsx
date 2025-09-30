import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { PopupConfirmarEdicao } from "../components/PopupConfirmarEdicao";
import { PopupConfirmarExclusao } from "../components/PopupConfirmarExclusao";
import { caseService } from "../services/caseService";

export default function History() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data] = useState([]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const cases = await caseService.getAllCases();
      setFilteredData(cases);
      setFilteredData(cases);
    } catch (err) {
      setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const mapApiToFrontend = (apiData) => {
    return {
      id: apiData._id || apiData.id,
      date: apiData.dataDeteccao || apiData.date,
      location: apiData.localizacao || apiData.location,
      infestationLevel: apiData.nivelInfestacao || apiData.infestationLevel,
      status: apiData.status || "Saudável",
      notes: apiData.observacoes || apiData.notes,
      owner: apiData.proprietario || apiData.owner,
      hectares: apiData.hectares || 0,
      qtdMudas: apiData.qtdMudas || 0,
      umidade: apiData.umidade || 0,
    };
  };

  const mapFrontendToApi = (frontendData) => {
    return {
      dataDeteccao: frontendData.date,
      localizacao: frontendData.location,
      nivelInfestacao: frontendData.infestationLevel,
      status: frontendData.status,
      observacoes: frontendData.notes,
      proprietario: frontendData.owner,
      hectares: frontendData.hectares,
      qtdMudas: frontendData.qtdMudas,
      umidade: frontendData.umidade,
    };
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const requestEditConfirm = async () => {
    try {
      const apiData = mapFrontendToApi(selectedItem);
      await caseService.updateCase(selectedItem.id, apiData);

      setShowConfirmEdit(true);
      fetchCases();
    } catch (err) {
      setError("Erro ao atualizar caso");
      console.error("Erro:", err);
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setShowConfirmEdit(false);
  };

  const requestDeleteConfirm = (id) => {
    setItemToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      await caseService.deleteCase(itemToDelete);
      setShowConfirmDelete(false);
      setItemToDelete(null);
      fetchCases();
    } catch (err) {
      setError("Erro ao deletar caso");
      console.error("Erro:", err);
    }
  };

  const getInfestationColor = (level) => {
    switch (level) {
      case "Baixo":
      case "Saudável":
        return "bg-green-100 text-green-800";
      case "Médio":
      case "Moderado":
        return "bg-yellow-100 text-yellow-800";
      case "Alto":
      case "Nocividade":
        return "bg-orange-100 text-orange-800";
      case "Crítico":
      case "Critico":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Saudável":
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Estável":
        return "bg-blue-100 text-blue-800";
      case "Em tratamento":
        return "bg-purple-100 text-purple-800";
      case "Crítico":
      case "Critico":
      case "Inativo":
      case "Inferiada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar title="Histórico de Detecções" />

        <main className="p-8">
          <div className="flex justify-between items-center mt-20 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredData.length} detecções encontradas
            </h2>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  viewMode === "cards"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Cards
              </button>
            </div>
          </div>

          {viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => {
                const frontendItem = mapApiToFrontend(item);
                return (
                  <div
                    key={frontendItem.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {frontendItem.location}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {frontendItem.date}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(frontendItem)}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              requestDeleteConfirm(frontendItem.id)
                            }
                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getInfestationColor(
                            frontendItem.infestationLevel
                          )}`}
                        >
                          {frontendItem.infestationLevel}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            frontendItem.status
                          )}`}
                        >
                          {frontendItem.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">
                              Proprietário
                            </p>
                            <p className="text-sm font-medium">
                              {frontendItem.owner}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>

                          <div>
                            <p className="text-xs text-gray-500">Área</p>
                            <p className="text-sm font-medium">
                              {frontendItem.hectares} ha
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Mudas</p>
                            <p className="text-sm font-medium">
                              {frontendItem.qtdMudas}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Umidade</p>
                            <p className="text-sm font-medium">
                              {frontendItem.umidade}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Observações:</span>{" "}
                          {frontendItem.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredData.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-700">
                Nenhuma detecção encontrada
              </h3>
              <p className="mt-2 text-gray-500">
                Tente ajustar os filtros ou verifique se há novas detecções.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => setFilteredData(data)}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </main>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Editar Detecção"
        >
          {selectedItem && (
            <form
              id="edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                requestEditConfirm();
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data da Detecção
                  </label>
                  <input
                    type="date"
                    value={selectedItem.date}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, date: e.target.value })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={selectedItem.location}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        location: e.target.value,
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Infestação
                  </label>
                  <select
                    value={selectedItem.infestationLevel}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        infestationLevel: e.target.value,
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  >
                    <option value="Baixo">Baixo</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Alto">Alto</option>
                    <option value="Crítico">Crítico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status da Pupunheira
                  </label>
                  <select
                    value={selectedItem.status}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  >
                    <option value="Saudável">Saudável</option>
                    <option value="Estável">Estável</option>
                    <option value="Em tratamento">Em tratamento</option>
                    <option value="Crítico">Crítico</option>
                    <option value="Inferiada">Inferiada</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={selectedItem.notes}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        notes: e.target.value,
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proprietário
                  </label>
                  <input
                    type="text"
                    value={selectedItem.owner}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        owner: e.target.value,
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hectares
                  </label>
                  <input
                    type="number"
                    value={selectedItem.hectares}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        hectares: e.target.value,
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Mudas
                  </label>
                  <input
                    type="number"
                    value={selectedItem.qtdMudas}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        qtdMudas: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umidade (%)
                  </label>
                  <input
                    type="number"
                    value={selectedItem.umidade}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        umidade: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            </form>
          )}
        </Modal>

        <PopupConfirmarEdicao
          isOpen={showConfirmEdit}
          onClose={() => setShowConfirmEdit(false)}
          onConfirm={handleSave}
        />

        <PopupConfirmarExclusao
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}

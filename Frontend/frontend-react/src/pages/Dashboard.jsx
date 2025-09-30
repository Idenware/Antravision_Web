import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { caseService } from "../services/dashService";
import { notificationService } from "../services/notificationService";
import { authService } from "../services/authService";

const HealthPieChart = ({
  healthDistribution = { saudavel: 0, moderado: 0, critico: 0 },
  size = 320,
  strokeWidth = 18,
}) => {
  const { saudavel = 0, moderado = 0, critico = 0 } = healthDistribution;
  const total = saudavel + moderado + critico;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { key: "saudavel", value: saudavel, color: "#10B981" },
    { key: "moderado", value: moderado, color: "#F59E0B" },
    { key: "critico", value: critico, color: "#EF4444" },
  ];

  let offset = 0;

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle
            r={radius}
            cx="0"
            cy="0"
            fill="transparent"
            stroke="#E6EEF6"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />

          {segments.map((seg) => {
            if (!seg.value || total === 0) {
              const length = 0;
              offset += length;
              return null;
            }

            const length = (seg.value / total) * circumference;
            const dashArray = `${length} ${circumference - length}`;
            const dashOffset = -offset;

            const circle = (
              <circle
                key={seg.key}
                r={radius}
                cx="0"
                cy="0"
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            );

            offset += length;
            return circle;
          })}
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-extrabold text-gray-800">
          {total > 0 ? Math.round((saudavel / total) * 100) : 0}%
        </span>
        <span className="text-sm text-gray-500">Saudáveis</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedNursery, setSelectedNursery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nurseryData, setNurseryData] = useState(null);
  const [nurseries, setNurseries] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [statsData, setStatsData] = useState({
    totalPlants: 0,
    totalCases: 0,
    riskLevel: "Moderado",
  });
  const [error, setError] = useState(null);

  const [healthDistribution, setHealthDistribution] = useState({
    saudavel: 0,
    moderado: 0,
    critico: 0,
  });

  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id ?? null;

  const normalizeStatus = (raw) => {
    if (!raw && raw !== "") return "";
    return String(raw)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const processCasesData = useCallback((casesData) => {
    if (!casesData || !Array.isArray(casesData)) {
      console.error("Dados de casos inválidos:", casesData);
      return;
    }

    let saudavel = 0;
    let moderado = 0;
    let critico = 0;

    casesData.forEach((caseItem) => {
      const raw = caseItem.nivelInfestacao || "";
      const s = normalizeStatus(raw);

      if (s.startsWith("saud")) saudavel++;
      else if (s.startsWith("moder")) moderado++;
      else if (s.startsWith("crit")) critico++;
    });

    setHealthDistribution({
      saudavel,
      moderado,
      critico,
    });

    const nurseriesMap = {};
    let totalPlants = 0;
    let totalCases = casesData.length;

    casesData.forEach((caseItem) => {
      const location = caseItem.localizacao || "Localização não informada";

      if (!nurseriesMap[location]) {
        nurseriesMap[location] = {
          name: location,
          plants: 0,
          issues: 0,
          humidity: 0,
          cases: [],
        };
      }

      const plantas = Number(caseItem.qtdMudas) || 0;
      nurseriesMap[location].plants += plantas;
      totalPlants += plantas;

      nurseriesMap[location].issues += 1;

      if (caseItem.umidade || caseItem.umidade === 0) {
        nurseriesMap[location].humidity = caseItem.umidade;
      }

      nurseriesMap[location].cases.push(caseItem);
    });

    const nurseriesArray = Object.values(nurseriesMap);

    const criticalNurseries = nurseriesArray.filter((n) => {
      const issueRatio = n.plants > 0 ? n.issues / n.plants : 0;
      return issueRatio > 0.1;
    }).length;

    let riskLevel = "Baixo";
    if (criticalNurseries > 2) {
      riskLevel = "Alto";
    } else if (criticalNurseries > 0) {
      riskLevel = "Moderado";
    }

    setStatsData({
      totalPlants,
      totalCases,
      riskLevel,
    });

    const transformedNurseries = nurseriesArray.map((nursery, index) => {
      const issueRatio =
        nursery.plants > 0 ? nursery.issues / nursery.plants : 0;
      let status = "normal";

      if (issueRatio > 0.1) status = "critico";
      else if (issueRatio > 0.05) status = "alerta";

      return {
        id: index + 1,
        name: nursery.name,
        status,
        plants: nursery.plants,
        issues: nursery.issues,
        humidity: nursery.humidity,
        details: nursery,
      };
    });

    setNurseries(transformedNurseries);
  }, []);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const casesData = await caseService.getAllCases();
      if (!Array.isArray(casesData)) {
        setCases([]);
        setLoading(false);
        return;
      }

      setCases(casesData);
      processCasesData(casesData);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar casos:", err);
      setError(err.message || "Erro ao buscar casos");
    } finally {
      setLoading(false);
    }
  }, [processCasesData]);

  const fetchNotifications = useCallback(async (userId) => {
    try {
      console.debug("Buscando notificações para userId:", userId);

      if (!userId) {
        console.warn("UserId inválido");
        setNotifications([]);
        return;
      }

      const notificationsData = await notificationService.getNotifications(
        userId
      );
      console.debug("Dados recebidos:", notificationsData);

      if (!notificationsData || notificationsData.length === 0) {
        console.warn("Nenhuma notificação recebida, usando dados mockados");
        const mockData = notificationService.getMockNotifications();
        setNotifications(mockData);
        return;
      }

      const normalized = (
        Array.isArray(notificationsData) ? notificationsData : []
      ).map((n, idx) => {
        const id = n.id || n._id || idx;
        const message =
          n.message || n.text || n.body || n.title || "Sem mensagem";
        const timestamp =
          n.timestamp || n.createdAt || n.date || new Date().toISOString();
        const type = (n.type || n.level || n.severity || "info")
          .toString()
          .toLowerCase();

        return { id, message, timestamp, type, raw: n };
      });

      setNotifications(normalized);
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        await fetchCases();

        if (!mounted) return;

        if (currentUserId) {
          await fetchNotifications(currentUserId);
        } else {
          console.warn("[Dashboard] currentUserId não disponível no loadData");
          setNotifications([]);
        }
      } catch (err) {
        console.error("Erro em loadData:", err);
        if (mounted) setError(err.message || "Erro ao carregar dados");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [fetchCases, fetchNotifications, currentUserId]);

  const renderStatusBadge = (status) => {
    const statusStyles = {
      normal: "bg-green-100 text-green-800",
      alerta: "bg-yellow-100 text-yellow-800",
      critico: "bg-red-100 text-red-800",
      moderado: "bg-orange-100 text-orange-800",
    };
    const statusLabels = {
      normal: "Normal",
      alerta: "Alerta",
      critico: "Crítico",
      moderado: "Moderado",
    };

    const normalizedStatus = (status || "normal").toLowerCase();
    const style = statusStyles[normalizedStatus] || statusStyles.normal;
    const label = statusLabels[normalizedStatus] || statusLabels.normal;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${style}`}>
        {label}
      </span>
    );
  };

  const getNurseryHealthDistribution = (nursery) => {
    const counts = { saudavel: 0, moderado: 0, critico: 0 };
    if (!nursery || !nursery.details || !Array.isArray(nursery.details.cases))
      return counts;

    nursery.details.cases.forEach((caseItem) => {
      const status = caseItem.nivelInfestacao;
      if (status === "Saudável") counts.saudavel++;
      else if (status === "Moderado") counts.moderado++;
      else if (status === "Crítico") counts.critico++;
    });

    return counts;
  };

  const openNurseryModal = (nursery) => {
    setSelectedNursery(nursery.id);
    setNurseryData(nursery);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNursery(null);
    setNurseryData(null);
  };

  const healthPercentage =
    statsData.totalPlants > 0
      ? ((statsData.totalPlants - statsData.totalCases) /
          statsData.totalPlants) *
        100
      : 0;

  const numCases = cases.length;

  const d = getNurseryHealthDistribution(nurseryData);

  const renderModal = () => {
    if (!isModalOpen || !nurseryData) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600 to-green-700">
            <div className="flex items-center">
              <div className="bg-white/20 p-1.5 rounded-md mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Detalhes do Viveiro
                </h3>
                <p className="text-emerald-100 text-sm">{nurseryData.name}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto p-4 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <div className="bg-gradient-to-br from-emerald-0 to-green-50 rounded-lg border border-emerald-200 p-3 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 bg-green-300 rounded-full opacity-20"></div>
                <div className="flex items-center mb-2">
                  <div className="bg-emerald-100 p-1 rounded-md mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Status
                  </h4>
                </div>
                <div className="text-center py-2">
                  <div className="mb-2 scale-100">
                    {renderStatusBadge(nurseryData.status)}
                  </div>
                  <div className="text-3xl font-bold text-emerald-700">
                    {nurseryData.plants}
                  </div>
                  <p className="text-sm text-gray-600">Total de Mudas</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-3 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 bg-amber-200 rounded-full opacity-20"></div>
                <div className="flex items-center mb-2 relative z-10">
                  <div className="bg-amber-100 p-1 rounded-md mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Casos de Antracnose
                  </h4>
                </div>
                <div className="text-center py-3 relative z-10">
                  <div className="text-3xl font-bold text-amber-700 mb-1">
                    {nurseryData.issues} <br />
                    Casos
                  </div>

                  <div className="flex flex-col items-center justify-center mb-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3].map((level) => {
                        const normalized =
                          nurseryData.plants > 0
                            ? (nurseryData.issues / nurseryData.plants) * 10
                            : 0;
                        const active = level <= normalized;
                        return (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              active ? "bg-amber-500" : "bg-amber-300"
                            }`}
                          ></div>
                        );
                      })}
                    </div>
                    <span className="text-sm text-amber-600">
                      {nurseryData.plants > 0 &&
                      (nurseryData.issues / nurseryData.plants) * 100 > 5
                        ? "Alta"
                        : "Baixa"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-3 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-15 h-15 -mr-4 -mt-4 bg-blue-300 rounded-full opacity-20"></div>
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 p-1 rounded-md mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
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
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Condição da Umidade
                  </h4>
                </div>
                <div className="grid gap-2 py-3">
                  <div className="text-center p-1 bg-blue-100 rounded-md shadow-xs h-[112px]">
                    <div className="text-3xl pt-6 font-bold text-blue-900">
                      {nurseryData.humidity ?? "-"}%
                    </div>
                    <div className="text-sm text-gray-600">Umidade</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
                <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-emerald-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                  </svg>
                  Distribuição de Saúde
                </h4>

                <div className="flex flex-col items-center">
                  <div className="relative w-72 h-72 mb-3">
                    <HealthPieChart
                      healthDistribution={d}
                      size={240}
                      strokeWidth={18}
                    />
                  </div>

                  <div className="flex flex-wrap justify-center gap-7">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div>
                      <div className="text-sm">
                        <span className="font-medium">Saudável: </span>
                        {(() => {
                          const d = getNurseryHealthDistribution(nurseryData);
                          const total = d.saudavel + d.moderado + d.critico;
                          return total > 0
                            ? Math.round((d.saudavel / total) * 100)
                            : 0;
                        })()}
                        %
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
                      <div className="text-sm">
                        <span className="font-medium">Moderado: </span>
                        {(() => {
                          const d = getNurseryHealthDistribution(nurseryData);
                          const total = d.saudavel + d.moderado + d.critico;
                          return total > 0
                            ? Math.round((d.moderado / total) * 100)
                            : 0;
                        })()}
                        %
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="text-sm">
                        <span className="font-medium">Crítico: </span>
                        {(() => {
                          const d = getNurseryHealthDistribution(nurseryData);
                          const total = d.saudavel + d.moderado + d.critico;
                          return total > 0
                            ? Math.round((d.critico / total) * 100)
                            : 0;
                        })()}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 bg-gradient-to-br from-emerald-0 to-green-50 rounded-lg border border-emerald-200 p-4 shadow-xs">
                <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-emerald-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Saúde Geral
                </h4>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-700 mb-1">
                      {Math.round(healthPercentage)}%
                    </div>
                    <div className="text-sm text-gray-600">Taxa de Saúde</div>
                  </div>

                  <div className="bg-white rounded-lg p-2 shadow-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        Saudáveis
                      </span>
                      <span className="text-sm font-bold text-emerald-700">
                        {Math.max(
                          0,
                          statsData.totalPlants - statsData.totalCases
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{
                          width: `${
                            statsData.totalPlants > 0
                              ? ((statsData.totalPlants -
                                  statsData.totalCases) /
                                  statsData.totalPlants) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-2 shadow-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        Doentes
                      </span>
                      <span className="text-sm font-bold text-amber-700">
                        {statsData.totalCases}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{
                          width: `${
                            statsData.totalPlants > 0
                              ? (statsData.totalCases / statsData.totalPlants) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-emerald-200">
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-1 rounded-full text-sm mb-1 ${
                          statsData.riskLevel === "Baixo"
                            ? "bg-emerald-100 text-emerald-800"
                            : statsData.riskLevel === "Moderado"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        Status: {statsData.riskLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="text-red-800 font-bold">Erro ao carregar dados</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchCases}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Navbar title="Monitoramento de Viveiros" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 mx-10">
          <div className="bg-white p-6 rounded-xl shadow text-center border-l-4 border-emerald-500">
            <div className="flex items-center justify-center mb-3 mt-4">
              <div className="bg-emerald-100 p-2 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-gray-600 font-medium text-base">
                Mudas Monitoradas
              </h3>
            </div>
            <div className="text-4xl font-bold text-emerald-600">
              {statsData.totalPlants} Mudas
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center border-l-4 border-amber-500">
            <div className="flex items-center justify-center mb-3 mt-4">
              <div className="bg-amber-100 p-2 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
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
              </div>
              <h3 className="text-gray-600 font-medium text-base">
                Casos de Antracnose
              </h3>
            </div>
            <div className="text-4xl font-bold text-amber-600">
              {numCases} Casos
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center border-l-4 border-blue-500">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-blue-100 p-2 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-600 font-medium text-base">
                Risco Médio
              </h3>
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {statsData.riskLevel}
            </div>
            <div className="mt-2 text-base text-gray-500">
              Baseado na análise dos casos
            </div>
          </div>
        </div>

        <div className="m-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-emerald-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            Visão Geral dos Viveiros
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {nurseries.length > 0 ? (
              nurseries.map((nursery) => (
                <div
                  key={nursery.id}
                  className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-all ${
                    selectedNursery === nursery.id
                      ? "ring-2 ring-emerald-500 border-emerald-300"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => openNurseryModal(nursery)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800">
                      {nursery.name}
                    </h3>
                    {renderStatusBadge(nursery.status)}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Mudas</div>
                      <div className="font-bold text-emerald-600">
                        {nursery.plants}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Problemas</div>
                      <div className="font-bold text-amber-600">
                        {nursery.issues}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        nursery.status === "normal"
                          ? "bg-green-500"
                          : nursery.status === "alerta"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${
                          nursery.plants > 0
                            ? (nursery.issues / nursery.plants) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-5 text-center py-8">
                <p className="text-gray-500">Nenhum viveiro encontrado</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg m-10">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Saúde das Mudas
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-emerald-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Distribuição de Saúde das Mudas
                  </h4>
                  <div
                    className="flex items-center justify-center"
                    style={{ minHeight: "400px" }}
                  >
                    <HealthPieChart healthDistribution={healthDistribution} />
                  </div>

                  <div className="flex justify-center mt-4 space-x-6">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-gray-600">
                        Saudável: {healthDistribution.saudavel}%
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-amber-400 mr-2"></div>
                      <span className="text-gray-600">
                        Moderado: {healthDistribution.moderado}%
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-400 mr-2"></div>
                      <span className="text-gray-600">
                        Crítico: {healthDistribution.critico}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-emerald-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Alertas e Notificações
                    </h4>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2"></div>
                    </div>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((item) => {
                        const isCritico =
                          item.type.includes("critic") ||
                          item.type.includes("error") ||
                          item.type.includes("alta");
                        const isAlerta =
                          item.type.includes("alert") ||
                          item.type.includes("warn") ||
                          item.type.includes("moderat");

                        return (
                          <div
                            key={item.id}
                            className={`flex items-start p-3 rounded-lg border ${
                              isCritico
                                ? "bg-red-50 border-red-200"
                                : isAlerta
                                ? "bg-yellow-50 border-yellow-200"
                                : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                isCritico
                                  ? "bg-red-100 text-red-600"
                                  : isAlerta
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {isCritico ? (
                                <svg
                                  className="h-5 w-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : isAlerta ? (
                                <svg
                                  className="h-5 w-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-5 w-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm">
                                {item.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(item.timestamp).toLocaleString(
                                  "pt-BR"
                                )}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                                  isCritico
                                    ? "bg-red-200 text-red-800"
                                    : isAlerta
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-blue-200 text-blue-800"
                                }`}
                              >
                                {item.type}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                        <p className="mt-2 text-gray-500">
                          Nenhuma notificação encontrada
                        </p>
                        <button
                          onClick={() => fetchNotifications(currentUserId)}
                          className="mt-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                        >
                          Recarregar notificações
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {renderModal()}
      </div>
    </div>
  );
}

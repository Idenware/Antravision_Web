// Main.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import Logo_Green from "../assets/new_logo.svg";
import { PopupAtualizado } from "../components/PopupAtualizado";
import { caseService } from "../services/mainService";

export default function Main() {
  const [showUpdatedPopup, setShowUpdatedPopup] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(
    new Date().toLocaleString("pt-BR")
  );

  const fetchCases = async () => {
    try {
      setLoading(true);
      const casesData = await caseService.getAllCases();
      setCases(casesData);
      setLastUpdate(new Date().toLocaleString("pt-BR"));
    } catch (error) {
      console.error("Erro ao buscar casos: ", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleRefresh = () => {
    fetchCases();
    setShowUpdatedPopup(true);
  };

  const calculateStats = () => {
    const totalCases = cases.length;

    const criticalCases = cases.filter(
      (caseItem) =>
        caseItem.nivelInfestacao === "Crítico" ||
        caseItem.nivelInfestacao === "Crítico"
    ).length;

    const mediumCases = cases.filter(
      (caseItem) =>
        caseItem.nivelInfestacao === "Moderado" ||
        caseItem.nivelInfestacao === "Moderado"
    ).length;

    const lowCases = cases.filter(
      (caseItem) =>
        caseItem.nivelInfestacao === "Saudável" ||
        caseItem.nivelInfestacao === "Saudável"
    ).length;

    let severitySum = 0;
    cases.forEach((caseItem) => {
      if (caseItem.nivelInfestacao === "Saudável") severitySum += 1;
      else if (caseItem.nivelInfestacao === "Moderado") severitySum += 2;
      else if (caseItem.nivelInfestacao === "Crítico") severitySum += 3;
    });

    const averageSeverity =
      totalCases > 0 ? (severitySum / totalCases).toFixed(1) : "0.0";

    let overallStatus = "Estável";
    if (criticalCases > totalCases * 0.3) overallStatus = "Crítico";
    else if (criticalCases > totalCases * 0.1) overallStatus = "Alerta";

    let riskForecast = {
      time: "6h",
      level: "Baixo",
      description: "Baixo risco nas próximas horas",
    };
    if (criticalCases > totalCases * 0.2) {
      riskForecast = {
        time: "2h",
        level: "Alto",
        description: "Alto risco nas próximas horas",
      };
    } else if (criticalCases > totalCases * 0.1) {
      riskForecast = {
        time: "4h",
        level: "Médio",
        description: "Médio risco nas próximas horas",
      };
    }
    return {
      totalCases,
      criticalCases,
      mediumCases,
      lowCases,
      averageSeverity,
      overallStatus,
      riskForecast,
    };
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

  const stats = calculateStats();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Navbar title="Visão Geral" onRefresh={handleRefresh} />

        <main className="mt-25 p-8 relative">
          <div className="mb-6 text-center">
            <div className="inline-block bg-white p-6 rounded-2xl shadow-lg mb-6">
              <img src={Logo_Green} alt="Logo" className="w-48 mx-auto mb-4" />
            </div>
            <h1 className="text-4xl font-bold text-emerald-700 mb-2">
              Bem-vindo ao AntraVision
            </h1>
            <p className="text-xl text-gray-600">
              Sistema Inteligente de Monitoramento de Antracnose
            </p>
          </div>

          <div className="mb-5 flex justify-center items-center">
            <div className="bg-white py-2 px-4 rounded-full shadow flex items-center">
              <span className="text-gray-500 mr-2">Última atualização:</span>
              <span className="font-medium">{lastUpdate}</span>
              <div className="ml-4 w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
              <div className="flex justify-between items-start mt-4.5">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Status Geral
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    {stats.overallStatus}
                  </p>
                </div>
                <div className="bg-emerald-100 p-2.5 rounded-full">
                  <i className="fas fa-check-circle text-emerald-600 text-xl pt-1"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mt-4.5">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total de Casos
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    {stats.totalCases} Casos
                  </p>
                </div>
                <div className="bg-blue-100 p-2.5 rounded-full">
                  <i className="fas fa-list text-blue-600 text-xl pt-1"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Gravidade
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    {stats.averageSeverity} %
                  </p>
                </div>
                <div className="bg-amber-100 p-2.5 rounded-full">
                  <i className="fas fa-exclamation-triangle text-amber-600 text-xl pt-1"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-amber-600 text-sm font-medium">
                  {stats.averageSeverity >= 2.5 ? "Moderada" : "Baixa"}
                </span>
                <div className="ml-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${(stats.averageSeverity / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-l-4 border-purple-500 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-100 rounded-full opacity-20"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Previsão de Risco
                </h3>
                <p className="text-2xl font-bold mt-2">
                  {stats.riskForecast.time}
                </p>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-full">
                <i className="fas fa-chart-line text-purple-600 text-xl pt-1"></i>
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                {stats.riskForecast.description}
              </span>
            </div>
          </div>
        </main>

        <PopupAtualizado
          isOpen={showUpdatedPopup}
          onClose={() => setShowUpdatedPopup(false)}
          ultimaAtualizacao={lastUpdate}
        />
      </div>
    </div>
  );
}

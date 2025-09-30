import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/new_logo.svg";
import Fundo from "../assets/fundo_cadastro2.jpg";
import { PopupContaCriada } from "../components/PopupContaCriada";
import { authService } from "../services/authService";

export default function Signup2() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const addressData = {
      logradouro: formData.get("logradouro"),
      cidade: formData.get("cidade"),
      estado: formData.get("estado"),
      cep: formData.get("cep"),
    };

    try {
      const tempUser = JSON.parse(localStorage.getItem("tempUser") || "{}");

      const userData = {
        ...tempUser,
        address: addressData,
      };

      const result = await authService.register(userData);

      if (result && (result._id || result.id)) {
        setShowSuccessPopup(true);
        localStorage.removeItem("tempUser");

        try {
          const loginResult = await authService.login(
            userData.email,
            userData.password
          );
          if (loginResult.user) {
            setTimeout(() => {
              navigate("/main");
            }, 2000);
          }
        } catch (loginError) {
          console.error("Erro no login automático:", loginError);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } else {
        setErrorMessage("Erro ao finalizar cadastro. Tente novamente.");
        alert(errorMessage);
      }
    } catch (error) {
      setErrorMessage(error.message || "Erro ao finalizar cadastro");
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-lime-100 to-neutral-50 p-4">
      <div className="w-full max-w-5xl h-[90vh] max-h-[700px] flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="hidden md:block md:w-2/5 bg-cover bg-center relative overflow-hidden">
          <button
            className="absolute top-6 left-6 z-10 text-md text-white font-semibold flex items-center hover:text-green-300 transition-colors cursor-pointer"
            onClick={() => window.history.back()}
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Voltar
          </button>
          <img
            src={Fundo}
            className="h-full brightness-50"
            alt="Fundo cadastro"
          />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Quase lá!</h2>
            <p className="opacity-90">
              Complete seu cadastro e comece a jornada
            </p>
          </div>
        </div>

        <div className="w-full md:w-3/5 flex flex-col items-center justify-center p-8 relative">
          <div className="w-full">
            <div className="flex justify-center w-full mb-8">
              <img src={Logo} alt="Logo" />
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                Tudo certo! Finalize e acesse já!
              </h3>
              <p className="text-gray-600">
                Precisamos apenas de mais alguns detalhes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  name="logradouro"
                  placeholder="Endereço"
                  required
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all focus:outline-none"
                />
                <svg
                  className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>

              <div className="relative">
                <input
                  name="cidade"
                  placeholder="Cidade"
                  required
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all focus:outline-none"
                />
                <svg
                  className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="estado"
                    required
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none focus:outline-none"
                  >
                    <option value="">Selecione o estado</option>
                    <option value="Acre (AC)">Acre (AC)</option>
                    <option value="Alagoas (AL)">Alagoas (AL)</option>
                    <option value="Amapá (AP)">Amapá (AP)</option>
                    <option value="Amazonas (AM)">Amazonas (AM)</option>
                    <option value="Bahia (BA)">Bahia (BA)</option>
                    <option value="Ceará (CE)">Ceará (CE)</option>
                    <option value="Distrito Federal (DF)">
                      Distrito Federal (DF)
                    </option>
                    <option value="Espírito Santo (ES)">
                      Espírito Santo (ES)
                    </option>
                    <option value="Goiás (GO)">Goiás (GO)</option>
                    <option value="Maranhão (MA)">Maranhão (MA)</option>
                    <option value="Mato Grosso (MT)">Mato Grosso (MT)</option>
                    <option value="Mato Grosso do Sul (MS)">
                      Mato Grosso do Sul (MS)
                    </option>
                    <option value="Minas Gerais (MG)">Minas Gerais (MG)</option>
                    <option value="Pará (PA)">Pará (PA)</option>
                    <option value="Paraíba (PB)">Paraíba (PB)</option>
                    <option value="Paraná (PR)">Paraná (PR)</option>
                    <option value="Pernambuco (PE)">Pernambuco (PE)</option>
                    <option value="Piauí (PI)">Piauí (PI)</option>
                    <option value="Rio de Janeiro (RJ)">
                      Rio de Janeiro (RJ)
                    </option>
                    <option value="Rio Grande do Norte (RN)">
                      Rio Grande do Norte (RN)
                    </option>
                    <option value="Rio Grande do Sul (RS)">
                      Rio Grande do Sul (RS)
                    </option>
                    <option value="Rondônia (RO)">Rondônia (RO)</option>
                    <option value="Roraima (RR)">Roraima (RR)</option>
                    <option value="Santa Catarina (SC)">
                      Santa Catarina (SC)
                    </option>
                    <option value="São Paulo (SP)">São Paulo (SP)</option>
                    <option value="Sergipe (SE)">Sergipe (SE)</option>
                    <option value="Tocantins (TO)">Tocantins (TO)</option>
                  </select>
                  <svg
                    className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                  <svg
                    className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>

                <div className="relative">
                  <input
                    name="cep"
                    placeholder="CEP"
                    required
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all focus:outline-none"
                  />
                  <svg
                    className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Finalizando..." : "Finalizar Cadastro"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Já faz parte da nossa plataforma?
                <a
                  href="/"
                  className="ml-1 text-green-600 font-semibold hover:underline"
                >
                  Faça login
                </a>
              </p>
            </div>
          </div>
        </div>

        <PopupContaCriada
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
        />
      </div>
    </div>
  );
}

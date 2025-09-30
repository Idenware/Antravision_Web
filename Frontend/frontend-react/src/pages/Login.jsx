import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Fundo from "../assets/fundo_login.avif";
import Logo from "../assets/new_logo.svg";
import { PopupDadosIncorretos } from "../components/PopupDadosIncorretos";
import { PopupAcessoConcedido } from "../components/PopupAcessoConcedido";
import { authService } from "../services/authService";

export default function Login() {
  const [showLoginError, setShowLoginError] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await authService.login(email, password);

      if (result.message === "Login realizado com sucesso") {
        setShowLoginSuccess(true);
        setTimeout(() => {
          navigate("/main");
        }, 1500);
      } else {
        setErrorMessage(result.message || "Email ou senha inválidos");
        setShowLoginError(true);
      }
    } catch (error) {
      setErrorMessage(error.message || "Erro ao fazer login");
      setShowLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-lime-100 to-neutral-50 p-4">
      <div className="w-full max-w-5xl h-[90vh] max-h-[700px] flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-0 bg-cover bg-center filter brightness-90 z-1">
            <img
              src={Fundo}
              className="h-full brightness-65"
              alt="Background"
            />
          </div>
          <div className="absolute bottom-10 left-10 right-10 text-white z-2">
            <h2 className="text-3xl font-bold mb-3">
              Cuidando do futuro das suas plantações
            </h2>
            <p className="opacity-80">
              Monitore, analise e previna doenças com nossa plataforma
              especializada
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 relative">
          <div className="w-full">
            <div className="flex justify-center w-full mb-8">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Bem-vindo <span className="text-green-600">de volta!</span>
              </h1>
              <p className="text-gray-600">
                Seus olhos no campo começam com um clique.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-700">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-700">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Entrar
              </button>

              <div className="mt-4 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Ainda não faz parte?{" "}
                  <a
                    href="/signup"
                    className="font-semibold text-green-600 transition-colors"
                  >
                    Crie sua conta agora.
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <PopupDadosIncorretos
        isOpen={showLoginError}
        onClose={() => setShowLoginError(false)}
        message={errorMessage}
      />
      <PopupAcessoConcedido
        isOpen={showLoginSuccess}
        onClose={() => setShowLoginSuccess(false)}
      />
    </div>
  );
}

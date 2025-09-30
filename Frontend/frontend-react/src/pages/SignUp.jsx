import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Fundo from "../assets/fundo_cadastro1.webp";
import Logo from "../assets/new_logo.svg";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      phone: formData.get("telefone"),
      password: formData.get("password"),
      address: {},
    };

    try {
      localStorage.setItem("tempUser", JSON.stringify(userData));
      navigate("/signup2");
    } catch (error) {
      setErrorMessage(error.message || "Erro ao processar dados");
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-lime-100 to-neutral-50 p-4">
      <div className="w-full max-w-5xl h-[90vh] max-h-[700px] flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="hidden md:block md:w-2/5 bg-cover bg-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition duration-1000 ease-in-out">
            <img src={Fundo} className="h-full brightness-50" />
          </div>
          <div className="absolute inset-0  mix-blend-multiply" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Junte-se à nossa comunidade
            </h2>
            <p className="opacity-90">
              Transforme sua vida com soluções sustentáveis
            </p>
          </div>
        </div>

        <div className="w-full md:w-3/5 flex flex-col items-center justify-center p-8">
          <div className="w-full">
            <div className="flex justify-center w-full mb-8">
              <img src={Logo} alt="Logo" />
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2  ">
                Cadastre-se!{" "}
                <span className="text-green-600">
                  Vamos juntos proteger sua plantação.
                </span>
              </h3>
              <p className="text-gray-600 ">
                Preencha seus dados e cultive decisões mais seguras.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    name="username"
                    placeholder="Nome"
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>

                <div className="relative">
                  <input
                    name="telefone"
                    placeholder="Telefone"
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all"
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  minLength={8}
                  onChange={(e) => validatePassword(e.target.value)}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all"
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                {passwordError && (
                  <p className="text-red-500 text-md mt-1">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Carregando..." : "Próximo"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Já faz parte da nossa plataforma?
                <a href="/" className="ml-1 text-green-600 font-semibold">
                  Faça login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

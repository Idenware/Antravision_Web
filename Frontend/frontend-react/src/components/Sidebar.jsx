import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo_Green from "../assets/new_logo.svg";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const linkBase =
    "flex items-center gap-4 p-3 rounded-lg transition-colors text-sm w-full";

  return (
    <aside className="w-64 bg-green-50 text-gray-800 p-6 flex flex-col fixed h-full border-r border-gray-200 shadow-md">
      <div className="flex flex-col items-center mb-8">
        <img src={Logo_Green} alt="Logo" className="w-32 mb-2" />
      </div>

      <nav className="flex-1 w-full space-y-2" aria-label="Main navigation">
        <NavLink
          to="/main"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-white shadow-sm text-green-700 font-semibold"
                : "text-gray-600 hover:bg-white hover:text-green-700"
            }`
          }
        >
          {({ isActive }) => (
            <div className="flex items-center w-full">
              <span
                className={`w-1 h-8 mr-3 rounded-r ${
                  isActive ? "bg-green-500" : "bg-transparent"
                }`}
              ></span>
              <i
                className="fas fa-home text-lg pr-10 w-6 text-center text-current"
                aria-hidden="true"
              ></i>
              <span>Home</span>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-white shadow-sm text-green-700 font-semibold"
                : "text-gray-600 hover:bg-white hover:text-green-700"
            }`
          }
        >
          {({ isActive }) => (
            <div className="flex items-center w-full">
              <span
                className={`w-1 h-8 mr-3 rounded-r ${
                  isActive ? "bg-green-500" : "bg-transparent"
                }`}
              ></span>
              <i
                className="fas fa-chart-bar text-lg pr-10 w-6 text-center text-current"
                aria-hidden="true"
              ></i>
              <span>Dashboard</span>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-white shadow-sm text-green-700 font-semibold"
                : "text-gray-600 hover:bg-white hover:text-green-700"
            }`
          }
        >
          {({ isActive }) => (
            <div className="flex items-center w-full">
              <span
                className={`w-1 h-8 mr-3 rounded-r ${
                  isActive ? "bg-green-500" : "bg-transparent"
                }`}
              ></span>
              <i
                className="fas fa-folder text-lg w-6 pr-10 text-center text-current"
                aria-hidden="true"
              ></i>
              <span>Histórico</span>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-white shadow-sm text-green-700 font-semibold"
                : "text-gray-600 hover:bg-white hover:text-green-700"
            }`
          }
        >
          {({ isActive }) => (
            <div className="flex items-center w-full">
              <span
                className={`w-1 h-8 mr-3 rounded-r ${
                  isActive ? "bg-green-500" : "bg-transparent"
                }`}
              ></span>
              <i
                className="fas fa-cogs text-lg w-6 pr-10 text-center text-current"
                aria-hidden="true"
              ></i>
              <span>Configurações</span>
            </div>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto w-full">
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 rounded-lg text-gray-600 hover:text-green-700 hover:bg-white transition-colors cursor-pointer"
          >
            <i
              className="fas fa-sign-out-alt text-lg w-6 text-center text-current"
              aria-hidden="true"
            ></i>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

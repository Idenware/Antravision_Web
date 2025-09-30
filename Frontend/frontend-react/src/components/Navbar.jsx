import React from "react";

export default function Navbar({ title, onRefresh }) {
  // Recuperar os dados do usuário do localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="ml-40 w-[calc(100%-35rem)] h-18 bg-white flex items-center justify-between px-9 fixed top-0 z-10 rounded-b-2xl shadow-md">
      <h1 className="text-emerald-700 text-2xl font-bold">{title}</h1>

      <div className="flex items-center gap-6">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <i className="fas fa-sync-alt"></i>
            <span>Atualizar</span>
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            <i className="fas fa-user"></i>
          </div>
          <div>
            <p className="text-sm font-semibold">
              {user.username || "Usuário"}
            </p>
            <p className="text-xs text-gray-500">
              {user.email || "email@exemplo.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

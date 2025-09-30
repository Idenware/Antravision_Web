import React from "react";

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {title || "Editar Detecção"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-5xl font-light bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors border border-gray-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              form="edit-form"
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

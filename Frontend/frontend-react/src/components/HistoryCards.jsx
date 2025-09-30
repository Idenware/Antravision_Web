import React from "react";

export default function HistoryCards({ data, onEdit, onDelete }) {
  return (
    <table className="w-full bg-white rounded shadow">
      <thead className="text-green-500 border-b-4 border-green-500">
        <tr>
          <th className="p-4 text-center font-semibold">Data da Detecção</th>
          <th className="p-4 text-center font-semibold">Localização</th>
          <th className="p-4 text-center font-semibold">Nível de Infestação</th>
          <th className="p-4 text-center font-semibold">
            Status da Pupunheira
          </th>
          <th className="p-4 text-center font-semibold">Observações</th>
          <th className="p-4 text-center font-semibold">Proprietário</th>
          <th className="p-4 text-center font-semibold">Hectares</th>
          <th className="p-4 text-center font-semibold">Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-gray-200 hover:bg-gray-50"
          >
            <td className="p-4 text-gray-800 font-medium text-center">
              {item.date}
            </td>
            <td className="p-4 text-gray-800 text-center">{item.location}</td>
            <td className="p-4 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.infestationLevel === "Baixo"
                    ? "bg-green-100 text-green-800"
                    : item.infestationLevel === "Médio"
                    ? "bg-yellow-100 text-yellow-800"
                    : item.infestationLevel === "Alto"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.infestationLevel}
              </span>
            </td>
            <td className="p-4 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === "Saudável"
                    ? "bg-green-100 text-green-800"
                    : item.status === "Estável"
                    ? "bg-blue-100 text-blue-800"
                    : item.status === "Em tratamento"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.status}
              </span>
            </td>
            <td className="p-4 text-gray-600 max-w-xs text-sm text-center">
              {item.notes}
            </td>
            <td className="p-4 text-gray-800 text-center">{item.owner}</td>
            <td className="p-4 text-gray-800 text-center">
              {item.hectares} ha
            </td>
            <td className="p-4 text-center">
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
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
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

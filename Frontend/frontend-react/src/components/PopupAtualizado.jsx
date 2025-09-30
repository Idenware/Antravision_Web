export const PopupAtualizado = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-10 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="text-center">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mt-4">Dados Atualizados!</h3>
          <p className="mt-2 text-gray-600">
            As informações foram atualizadas com sucesso.
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

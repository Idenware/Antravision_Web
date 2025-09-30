export const PopupConfirmarExclusao = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-10 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mt-4 text-red-600">
            Confirmar Exclusão
          </h3>
          <p className="mt-2 text-gray-600">
            Esta ação é irreversível. Tem certeza que deseja excluir?
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-full transition cursor-pointer"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

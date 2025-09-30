export const PopupDadosIncorretos = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-10 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h3 className="text-xl font-bold mt-4 text-red-600">
            Dados Incorretos
          </h3>
          <p className="mt-2 text-gray-600">
            Verifique seu e-mail e senha e tente novamente.
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition cursor-pointer"
          >
            <a href="/">Tentar Novamente</a>
          </button>
        </div>
      </div>
    </div>
  );
};

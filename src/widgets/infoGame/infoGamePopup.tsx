import React from "react";
import { cn } from "@/lib/utils"; // Importar utilidad cn de ShadCN para manejar clases dinámicas

interface VictoryPopupProps {
  message: string; // Mensaje de victoria personalizado
  onClose: () => void; // Función para cerrar el popup
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ message, onClose }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center "
      )}
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center animate-fade-in"
        )}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Estado de la partida 
        </h1>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={cn(
            "px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
          )}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default VictoryPopup;

import { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select';
import apiClient from '@/service/apiClient';

export interface GameMode {
  id: number;
  name: string;
  description: string;
}

interface GameModeDropdownProps {
  onSelect: (selectedMode: GameMode | null) => void;
}

const GameModeDropdown = ({ onSelect } : GameModeDropdownProps) => {
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

useEffect(() => {
  const fetchGameModes = async () => {
    try {
      const response = await apiClient.get<GameMode[]>('api/gamemodes');

      console.log('Game modes:', response.data);

      if (Array.isArray(response.data)) {
        setGameModes(response.data);

        if (response.data.length > 0) {
          const defaultMode = response.data[0];
          setSelectedMode(defaultMode);
          onSelect(defaultMode);
        }
      } else {
        console.error('Response data is not an array:', response.data);
        setGameModes([]); // Asegúrate de que `gameModes` sea un arreglo
      }
      
    } catch (error) {
      console.error('Error al obtener modos de juego:', error);
      setGameModes([]); // Manejo de errores: establece un arreglo vacío
    }
  };

  fetchGameModes();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleSelect = (modeId: string) => {
    const mode = gameModes.find((gm) => gm.id.toString() === modeId) || null;
    setSelectedMode(mode);
    onSelect(mode); 
  };

  return (
    <div className="w-64">
      <Select value={selectedMode?.id?.toString() || ''} onValueChange={handleSelect}>
        <SelectTrigger className="flex items-center justify-between px-3 py-2 bg-white rounded-lg shadow-md border border-gray-300 focus:outline-none focus:border-indigo-500">
          <SelectValue placeholder="Game mode" />
        </SelectTrigger>
        <SelectContent>
          {gameModes.map((mode) => (
            <SelectItem key={mode.id} value={mode.id.toString()}>
              {mode.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameModeDropdown;

import GameModeDropdown, { GameMode } from '@/components/gameModeDropdown';
import { useState } from 'react';

export function Play() {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);

  const handleGameModeSelect = (mode: GameMode | null) => {
    setSelectedGameMode(mode);
  };

  return (
    <div className="p-8">

      <GameModeDropdown onSelect={handleGameModeSelect} />

      {selectedGameMode && (
        <div className="mt-4">
          <p className="text-2xl font-bold">{selectedGameMode.name}</p>
          <p className="text-2xl font-bold">{selectedGameMode.description}</p>

        </div>
      )}
    </div>
  );
}

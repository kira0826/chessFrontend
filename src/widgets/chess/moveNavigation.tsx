import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Play } from '@/models/types';

interface MoveNavigationProps {
  plays: Play[];
  currentMoveIndex: number;
  onMoveSelect: (index: number) => void;
}

const MoveNavigation: React.FC<MoveNavigationProps> = ({
  plays,
  currentMoveIndex,
  onMoveSelect,
}) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Navigation Controls */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => onMoveSelect(currentMoveIndex - 1)}
          disabled={currentMoveIndex === -1}
          className="p-2 bg-white rounded-full disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <span className="font-medium">
          Move {currentMoveIndex + 1} / {plays.length}
        </span>
        
        <button
          onClick={() => onMoveSelect(currentMoveIndex + 1)}
          disabled={currentMoveIndex === plays.length - 1}
          className="p-2 bg-white rounded-full disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Move List */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              <th className="py-2 text-left pl-4">N°</th>
              <th className="py-2 text-left">White</th>
              <th className="py-2 text-left">Black</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(plays.length / 2) }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-300">
                <td className="py-2 pl-4">{i + 1}.</td>
                <td
                  className={`py-2 cursor-pointer ${
                    currentMoveIndex === i * 2 ? 'bg-blue-200' : ''
                  }`}
                  onClick={() => plays[i * 2] && onMoveSelect(i * 2)}
                >
                  {plays[i * 2]?.origin + '-' + plays[i * 2]?.destination}
                </td>
                <td
                  className={`py-2 cursor-pointer ${
                    currentMoveIndex === i * 2 + 1 ? 'bg-blue-200' : ''
                  }`}
                  onClick={() => plays[i * 2 + 1] && onMoveSelect(i * 2 + 1)}
                >
                  {plays[i * 2 + 1]?.origin + '-' + plays[i * 2 + 1]?.destination}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoveNavigation;
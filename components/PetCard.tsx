import React from 'react';
import { Pet } from '../types';
import { PetIcon } from './Icons';
import { Trash2, Edit2 } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onClick, onEdit, onDelete }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-orange-200 overflow-hidden"
    >
     
      
      <div className="relative z-10">
        <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full ${pet.avatarColor} flex items-center justify-center text-amber-800 shadow-sm border border-white`}>
          <PetIcon type={pet.type} className="w-6 h-6" />
        </div>
        
        <div className="mt-2">
          <h3 className="text-xl font-bold text-amber-900">{pet.name}</h3>
          <p className="text-sm text-amber-700 font-medium">{pet.breed}</p>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg">
            <span className="text-xs text-orange-400 uppercase tracking-wider">Age</span>
            <p className="font-semibold text-amber-800">{pet.age}y</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg">
            <span className="text-xs text-orange-400 uppercase tracking-wider">Weight</span>
            <p className="font-semibold text-amber-800">{pet.weight}kg</p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
              onClick={onEdit}
              className="p-2 text-orange-300 hover:text-amber-800 hover:bg-orange-100 rounded-full transition-colors"
              title="Edit Pet"
          >
              <Edit2 className="w-4 h-4" />
          </button>
          <button 
              onClick={onDelete}
              className="p-2 text-orange-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Pet"
          >
              <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
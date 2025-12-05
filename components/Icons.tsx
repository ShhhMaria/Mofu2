import React from 'react';
import { Dog, Cat, Bird, HelpCircle, Utensils, Footprints, Pill, Gamepad2, Scissors } from 'lucide-react';

export const PetIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'dog': return <Dog className={className} />;
    case 'cat': return <Cat className={className} />;
    case 'bird': return <Bird className={className} />;
    default: return <HelpCircle className={className} />;
  }
};

export const TaskIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'food': return <Utensils className={className} />;
    case 'walk': return <Footprints className={className} />;
    case 'medication': return <Pill className={className} />;
    case 'play': return <Gamepad2 className={className} />;
    case 'grooming': return <Scissors className={className} />;
    default: return <HelpCircle className={className} />;
  }
};

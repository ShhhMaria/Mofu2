export interface Pet {
  id: string;
  userId: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  type: 'dog' | 'cat' | 'bird' | 'other';
  avatarColor: string;
  photo?: string;
}

export interface Task {
  id: string;
  petId: string;
  title: string;
  time: string;
  completed: boolean;
  type: 'food' | 'walk' | 'medication' | 'play' | 'grooming';
  date?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const COLORS = [
  'bg-orange-100', 'bg-amber-100', 'bg-yellow-100', 'bg-lime-100',
  'bg-green-100', 'bg-teal-100', 'bg-yellow-50', 'bg-orange-50',
  'bg-red-100', 'bg-rose-100', 'bg-pink-100', 'bg-fuchsia-100',
  'bg-purple-100', 'bg-indigo-100', 'bg-blue-100', 'bg-cyan-100'
];

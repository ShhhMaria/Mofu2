import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PetCalendarProps {
  tasks: Task[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function PetCalendar({ tasks, selectedDate, onDateSelect }: PetCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate || new Date())
  );

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTasksForDate = (day: number) => {
    const dateStr = formatDate(day);
    return tasks.filter((t) => t.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const todayString = getTodayString();

  return (
    <div className="bg-white rounded-lg border border-orange-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-amber-900 text-lg">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-amber-700" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-amber-700" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-amber-700 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = formatDate(day);
          const dayTasks = getTasksForDate(day);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayString;
          const isPastDate = dateStr < todayString;

          return (
            <button
              key={`${day}-${idx}`}
              onClick={() => !isPastDate && onDateSelect(dateStr)}
              disabled={isPastDate}
              className={`aspect-square p-2 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-start ${
                isPastDate
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : isSelected
                  ? 'bg-amber-500 text-white'
                  : isToday
                  ? 'bg-orange-100 text-amber-900 border-2 border-amber-500'
                  : dayTasks.length > 0
                  ? 'bg-orange-50 text-amber-900 border border-orange-200'
                  : 'text-amber-700 hover:bg-orange-50 cursor-pointer'
              }`}
            >
              <span>{day}</span>
              {dayTasks.length > 0 && !isPastDate && (
                <span className="text-xs mt-1 font-bold">
                  {dayTasks.filter((t) => !t.completed).length} due
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

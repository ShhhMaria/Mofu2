import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet, Task } from '../types';
import { StorageService } from '../services/storageService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TaskIcon, PetIcon } from '../components/Icons';
import { PetCalendar } from '../components/PetCalendar';
import { ArrowLeft, CheckCircle2, Circle, Trash2, Plus, Edit2, X } from 'lucide-react';

export default function PetPlanner() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [form, setForm] = useState({
    title: '',
    time: '',
    type: 'food' as Task['type'],
    date: ''
  });

  useEffect(() => {
    if (petId) load();
  }, [petId]);

  useEffect(() => {
    setForm(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  const load = async () => {
    if (!petId) return;
    try {
      const pets = await StorageService.getPets();
      const p = pets.find(x => x.id === petId);
      if (p) {
        setPet(p);
        const t = await StorageService.getSchedulesByPet(petId);
        const completedTasks = await StorageService.getCompletedTasksByPet(petId);
        setTasks([...t, ...completedTasks]);
      } else {
        navigate('/');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      const updated = await StorageService.toggleTask(task);
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, isCompleted: boolean) => {
    if (window.confirm("Delete this task?")) {
      await StorageService.deleteTask(id, isCompleted);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet || !form.title || !form.time || !form.date) return;

    const todayStr = getTodayString();
    const currentTime = getCurrentTime();

    // Check if date is in the past
    if (form.date < todayStr) {
      alert("❌ Cannot set tasks for past dates");
      return;
    }

    // Check if time is in the past for today's date
    if (form.date === todayStr && form.time <= currentTime) {
      alert(`❌ Cannot set tasks for past times. Current time is ${currentTime}`);
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        const task = tasks.find(t => t.id === editId);
        if (task) {
          const updated = { ...task, title: form.title, time: form.time, type: form.type, date: form.date };
          await StorageService.updateTask(updated);
          setTasks(tasks.map(t => t.id === editId ? updated : t));
        }
      } else {
        const task = await StorageService.saveTask({
          petId: pet.id,
          title: form.title,
          time: form.time,
          type: form.type,
          date: form.date,
          completed: false
        });
        setTasks([...tasks, task]);
      }
      resetForm();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setShowTaskForm(false);
    setEditId(null);
    setForm({ title: '', time: '', type: 'food', date: selectedDate });
  };

  const todaysTasks = tasks
    .filter(t => t.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const todayStr = getTodayString();
  const minDate = todayStr;

  if (!pet) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-lg bg-white hover:bg-orange-50 border border-orange-200"
        >
          <ArrowLeft className="w-5 h-5 text-amber-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-amber-900">{pet.name}'s Tasks</h1>
          <p className="text-sm text-amber-700">{pet.breed}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg ${pet.avatarColor} flex items-center justify-center`}>
          <PetIcon type={pet.type} className="w-5 h-5 text-amber-900" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1">
          <PetCalendar 
            tasks={tasks}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Date Display */}
          <div className="bg-white rounded-lg border border-orange-200 p-4">
            <p className="text-sm text-amber-700">
              Selected Date: <span className="font-bold text-amber-900">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>

          {/* Tasks for Selected Date */}
          <div className="bg-white rounded-lg border border-orange-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-amber-900">Tasks for Today</h2>
              <button 
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="p-2 hover:bg-orange-100 rounded-lg text-amber-700"
              >
                {showTaskForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>

            {showTaskForm && (
              <form onSubmit={handleSaveTask} className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="space-y-3 mb-4">
                  <Input 
                    label="Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input 
                      label="Time"
                      type="time"
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      required
                    />
                    <Input 
                      label="Date"
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      min={minDate}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-1">Type</label>
                      <select 
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-300"
                        value={form.type}
                        onChange={e => setForm({ ...form, type: e.target.value as Task['type'] })}
                      >
                        <option value="food">Food</option>
                        <option value="walk">Walk</option>
                        <option value="play">Play</option>
                        <option value="medication">Medication</option>
                        <option value="grooming">Grooming</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="secondary" size="sm" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" size="sm" isLoading={saving}>Save</Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {todaysTasks.map(task => (
                <div 
                  key={task.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition ${task.completed ? 'bg-orange-50 border-orange-100' : 'border-orange-200 hover:border-orange-300'}`}
                >
                  <button 
                    onClick={() => handleToggle(task)}
                    className="text-orange-400 hover:text-amber-700"
                  >
                    {task.completed ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5" />}
                  </button>
                  
                  <div className="p-2 rounded bg-orange-100 text-amber-700">
                    <TaskIcon type={task.type} className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${task.completed ? 'line-through text-orange-400' : 'text-amber-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-amber-700">{task.time}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {task.completed ? '✓ Done' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        setEditId(task.id);
                        setForm({ title: task.title, time: task.time, type: task.type, date: task.date || selectedDate });
                        setShowTaskForm(true);
                      }}
                      className="p-2 text-orange-400 hover:text-amber-800 hover:bg-orange-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id, task.completed)}
                      className="p-2 text-orange-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {todaysTasks.length === 0 && (
                <div className="text-center py-8 text-orange-400 text-sm">
                  No tasks scheduled for this day. Add one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-1" />
        <div className="lg:col-span-3 bg-white rounded-lg border border-orange-200 p-6">
          <h3 className="font-bold text-amber-900 mb-4">Pet Info</h3>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-amber-700 block mb-1">Weight</span>
              <span className="font-medium text-amber-900">{pet.weight} kg</span>
            </div>
            <div>
              <span className="text-amber-700 block mb-1">Age</span>
              <span className="font-medium text-amber-900">{pet.age} years</span>
            </div>
            <div>
              <span className="text-amber-700 block mb-1">Breed</span>
              <span className="font-medium text-amber-900">{pet.breed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

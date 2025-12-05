import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet, COLORS } from '../types';
import { StorageService } from '../services/storageService';
import { PetCard } from '../components/PetCard';
import { Button } from '../components/Button';
import { Plus, X, Dog, Cat, Bird, Camera } from 'lucide-react';
import { Input } from '../components/Input';
import { validateName } from '../utils/validation';

export default function Dashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    type: 'dog' as Pet['type'],
    photo: ''
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const data = await StorageService.getPets();
      setPets(data);
    } catch (e) {
      console.error("Failed to load pets", e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', breed: '', age: '', weight: '', type: 'dog', photo: '' });
    setErrors({});
    setEditingId(null);
  };

  const openModal = (pet?: Pet) => {
    if (pet) {
      setEditingId(pet.id);
      setForm({
        name: pet.name,
        breed: pet.breed,
        age: pet.age.toString(),
        weight: pet.weight.toString(),
        type: pet.type,
        photo: pet.photo || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameVal = validateName(form.name);
    if (!nameVal.isValid) {
      setErrors({ name: nameVal.error! });
      return;
    }
    if (!form.breed) {
      setErrors({ breed: "Breed is required" });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const pet = pets.find(p => p.id === editingId);
        if (pet) {
          const updated = {
            ...pet,
            name: form.name,
            breed: form.breed,
            age: parseFloat(form.age) || 0,
            weight: parseFloat(form.weight) || 0,
            type: form.type,
            photo: form.photo || undefined
          };
          await StorageService.updatePet(updated);
          setPets(pets.map(p => p.id === editingId ? updated : p));
        }
      } else {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const newPet = await StorageService.savePet({
          name: form.name,
          breed: form.breed,
          age: parseFloat(form.age) || 0,
          weight: parseFloat(form.weight) || 0,
          type: form.type,
          avatarColor: color,
          userId: '',
          photo: form.photo || undefined
        });
        setPets([...pets, newPet]);
      }
      closeModal();
    } catch (e) {
      setErrors({ form: "Failed to save pet" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this pet?")) {
      await StorageService.deletePet(id);
      setPets(pets.filter(p => p.id !== id));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = 200;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 200, 200);
            const compressed = canvas.toDataURL('image/webp', 0.4);
            if (compressed.length > 10000) {
              console.warn('Pet photo too large even after compression');
              setForm({ ...form, photo: '' });
            } else {
              setForm({ ...form, photo: compressed });
            }
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">My Pets</h1>
        <p className="text-amber-700">Manage your pets and their daily routines</p>
      </div>

      {pets.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-orange-200">
          <div className="bg-orange-50 p-4 rounded-lg mb-4 inline-block">
            <Dog className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-amber-900 mb-2">No pets yet</h3>
          <p className="text-amber-700 mb-6">Add your first pet to get started</p>
          <Button onClick={() => openModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Add Pet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map(pet => (
            <PetCard 
              key={pet.id} 
              pet={pet} 
              onClick={() => navigate(`/pet/${pet.id}`)}
              onEdit={(e) => { e.stopPropagation(); openModal(pet); }}
              onDelete={(e) => handleDelete(e, pet.id)}
            />
          ))}
          <button 
            onClick={() => openModal()}
            className="flex flex-col items-center justify-center bg-white border border-dashed border-orange-300 rounded-lg p-6 hover:border-orange-400 transition"
          >
            <Plus className="w-6 h-6 text-orange-400 mb-2" />
            <span className="text-orange-600 font-medium">Add Pet</span>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-amber-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-900">
                {editingId ? 'Edit Pet' : 'Add Pet'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-orange-100 rounded">
                <X className="w-5 h-5 text-orange-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Pet Photo</label>
                <div className="flex items-center gap-4">
                  {form.photo && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-orange-200">
                      <img src={form.photo} alt="Pet preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 px-4 py-3 border border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50 transition">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 text-amber-700">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-medium">Upload Photo</span>
                    </div>
                  </label>
                </div>
              </div>

              <Input 
                label="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Type</label>
                  <div className="flex gap-1 bg-orange-50 p-1 rounded">
                    {(['dog', 'cat', 'bird', 'other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        className={`flex-1 py-2 rounded text-sm transition ${form.type === t ? 'bg-white shadow text-amber-900' : 'text-orange-300'}`}
                      >
                        {t === 'dog' && <Dog className="w-4 h-4 mx-auto" />}
                        {t === 'cat' && <Cat className="w-4 h-4 mx-auto" />}
                        {t === 'bird' && <Bird className="w-4 h-4 mx-auto" />}
                        {t === 'other' && <span className="text-xs">◯</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <Input 
                  label="Breed"
                  value={form.breed}
                  onChange={e => setForm({ ...form, breed: e.target.value })}
                  error={errors.breed}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Age (years)"
                  type="number"
                  step="0.1"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                />
                <Input 
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={e => setForm({ ...form, weight: e.target.value })}
                />
              </div>

              {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

              <Button type="submit" className="w-full" isLoading={saving}>
                {editingId ? 'Update' : 'Save'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
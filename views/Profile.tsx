import React, { useState } from 'react';
import { User } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthService } from '../services/authService';
import { validateName, validateEmail } from '../utils/validation';
import { Camera, Save, LogOut, Upload } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export default function Profile({ user, onUpdateUser, onLogout }: ProfileProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Just read the file directly - we're storing it locally only
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    // Validation
    const nameVal = validateName(name);
    const emailVal = validateEmail(email);
    const newErrors: any = {};
    if (!nameVal.isValid) newErrors.name = nameVal.error;
    if (!emailVal.isValid) newErrors.email = emailVal.error;
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      // Only update name in Firebase auth (not avatar)
      const updated = await AuthService.updateProfile({ name, email, bio });
      onUpdateUser({ ...updated, avatar: avatar });
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      console.error('Update error:', err);
      setMessage(`❌ Failed to update profile: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">My Profile</h1>
          <p className="text-amber-700">Manage your account settings.</p>
        </div>
        <Button variant="secondary" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-200 relative overflow-hidden">
        {/* Simple Minimalist Header bg */}
        <div className="absolute top-0 left-0 w-full h-32 bg-orange-100"></div>

        <div className="relative">
          {/* Avatar Section */}
          <div className="flex flex-col items-center -mt-4 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Camera className="w-6 h-6 text-white" />
              </label>
            </div>
            <h2 className="mt-3 text-xl font-bold text-amber-900">{user.name}</h2>
            <p className="text-amber-700 text-sm">Member</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6 max-w-lg mx-auto">
            <Input 
              label="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            
            <Input 
              label="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled
            />
            
            <Input 
              label="Bio" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              isTextArea
              placeholder="Tell us a bit about yourself and your pets..."
            />

            {message && (
              <div className={`p-3 rounded-xl text-center text-sm font-medium ${message.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {message}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
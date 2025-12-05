import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { AuthService } from '../services/authService';
import { User } from '../types';
import { PawPrint, ArrowRight } from 'lucide-react';
import { isFirebaseConfigured } from '../firebaseConfig';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    // Email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
      isValid = false;
    }

    // Password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error!;
      isValid = false;
    }

    // Name (Only for signup)
    if (!isLoginMode) {
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.error!;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      if (isLoginMode) {
        await AuthService.login(email, password);
      } else {
        await AuthService.signup(name, email, password);
      }
      // App.tsx auth listener will handle the redirect
    } catch (err: any) {
      console.error(err);
      let msg = "Authentication failed. Please check your credentials.";
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered.";
      if (err.code === 'auth/weak-password') msg = "Password is too weak.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/invalid-email') msg = "Invalid email address.";
      const detailed = err?.message ? ` ${err.message}` : '';
      setErrors({ form: `${msg}${detailed}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-orange-50">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] border border-orange-200">
        
        {/* Left Side - Hero */}
        <div className="hidden md:flex flex-col justify-between bg-amber-800 p-12 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                <PawPrint className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Mofu2</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Minimalist care for your pets.
            </h1>
            <p className="text-amber-100 text-lg">
              Manage schedules, tasks, and health records with a clean, and aesthetic interface.
            </p>
          </div>

          <div className="relative z-10">
             <div className="text-sm text-slate-500">
                © 2025 Mofu2
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-2">
              {isLoginMode ? 'Welcome back' : 'Create Account'}
            </h2>
            <p className="text-amber-700">
              {isLoginMode 
                ? 'Please enter your details to sign in.' 
                : 'Start your journey with us today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isFirebaseConfigured && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-2">
                <div className="font-bold text-base">⚙️ Firebase Setup Required</div>
                <div className="text-sm">
                  1. Copy <span className="font-mono bg-amber-100 px-2 py-1 rounded">.env.local.example</span> to <span className="font-mono bg-amber-100 px-2 py-1 rounded">.env.local</span>
                </div>
                <div className="text-sm">
                  2. Paste your Firebase project values from <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Firebase Console</a>
                </div>
                <div className="text-sm">
                  3. Restart the dev server: <span className="font-mono bg-amber-100 px-2 py-1 rounded text-xs">npm run dev</span>
                </div>
              </div>
            )}
            {!isLoginMode && (
              <Input 
                label="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="e.g. Jane Doe"
              />
            )}
            
            <Input 
              label="Email Address" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="jane@example.com"
            />

            <Input 
              label="Password" 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />
            
            {/* Password Requirement Hint */}
            {!isLoginMode && (
               <p className="text-xs text-slate-400 px-1">
                 Password must be 8+ chars, include uppercase, lowercase, number & special char.
               </p>
            )}

            {errors.form && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                {errors.form}
              </div>
            )}

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                isLoading={isLoading}
              >
                {isLoginMode ? 'Sign In' : 'Sign Up'} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-amber-700">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setErrors({});
                  setPassword('');
                }}
                className="text-amber-900 font-bold hover:underline"
              >
                {isLoginMode ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 text-xs">
            <strong>💡 Tip:</strong> Use any email and password to get started. Your data is securely stored.
          </div>
        </div>
      </div>
    </div>
  );
}

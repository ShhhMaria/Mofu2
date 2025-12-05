import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutGrid, PawPrint, User as UserIcon, Home as HomeIcon } from 'lucide-react';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import PetPlanner from './views/PetPlanner';
import Login from './views/Login';
import Profile from './views/Profile';
import { AuthService } from './services/authService';
import { User } from './types';

const NavBar = () => {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-amber-900 bg-orange-100'
      : 'text-amber-700 hover:text-amber-900';

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-orange-200 px-6 py-4 flex justify-around items-center z-50 md:sticky md:top-0 md:h-screen md:w-20 md:flex-col md:justify-start md:gap-8 md:border-r md:border-t-0 md:py-8">
      <div className="hidden md:flex bg-amber-700 p-2 rounded-lg text-white mb-4">
        <PawPrint className="w-6 h-6 fill-current" />
      </div>
      <Link to="/" className={`p-3 rounded-lg transition ${isActive('/')}`}>
        <HomeIcon className="w-6 h-6" />
      </Link>
      <Link to="/pets" className={`p-3 rounded-lg transition ${isActive('/pets')}`}>
        <LayoutGrid className="w-6 h-6" />
      </Link>
      <Link to="/profile" className={`p-3 rounded-lg transition ${isActive('/profile')}`}>
        <UserIcon className="w-6 h-6" />
      </Link>
    </nav>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = AuthService.subscribe((u) => {
        console.log('User logged in:', u);
        setUser(u);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err: any) {
      console.error('Auth subscribe error:', err);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Connecting to Firebase...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <div className="min-h-screen bg-orange-50 md:flex text-amber-900">
          <NavBar />
          <main className="flex-1 pb-24 md:pb-0 h-screen overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets" element={<Dashboard />} />
              <Route path="/pet/:petId" element={<PetPlanner />} />
              <Route
                path="/profile"
                element={<Profile user={user} onUpdateUser={setUser} onLogout={AuthService.logout} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </HashRouter>
  );
}
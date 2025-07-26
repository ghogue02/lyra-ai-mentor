
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getNavbarIconUrl } from '@/utils/supabaseIcons';

interface NavbarProps {
  showAuthButtons?: boolean;
  onSignOut?: () => void;
}

export const Navbar = ({
  showAuthButtons = true,
  onSignOut
}: NavbarProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      signOut();
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50 safe-top">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
          >
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
              <img 
                src={getNavbarIconUrl('logo')} 
                alt="AI Learning Platform"
                className="w-12 h-12 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Auth Actions */}
          {showAuthButtons && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

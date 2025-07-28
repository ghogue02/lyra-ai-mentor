
import React from 'react';
import { BrandedButton } from "@/components/ui/BrandedButton";
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
    <nav className="fixed top-0 w-full z-50 safe-top" style={{background: 'var(--nm-bg)'}}>
      <div className="container mx-auto px-4 py-3">
        <div className="nm-nav px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleHomeClick}
            >
              <div className="nm-icon w-16 h-16">
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
                <button
                  className="nm-button px-4 py-2 flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

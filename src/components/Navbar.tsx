
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50 safe-top">
      <div className="container mx-auto spacing-mobile h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <span className="font-bold text-lg sm:text-xl gradient-text">Lyra</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {showAuthButtons ? (
            // Unauthenticated navigation (landing page)
            <div className="flex items-center gap-2">
              {/* Add auth buttons here if needed */}
            </div>
          ) : (
            // Authenticated navigation (dashboard)
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="mobile-button flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Sign Out</span>
              <span className="xs:hidden">Exit</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

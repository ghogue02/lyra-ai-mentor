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
  const {
    signOut
  } = useAuth();
  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      signOut();
    }
  };
  return <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
        </div>
        
        <div className="flex items-center gap-4">
          {showAuthButtons ?
        // Unauthenticated navigation (landing page)
        <>
              
              
              
            </> :
        // Authenticated navigation (dashboard)
        <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>}
        </div>
      </div>
    </nav>;
};
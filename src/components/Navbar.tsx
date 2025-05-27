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
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {showAuthButtons ?
        // Unauthenticated navigation (landing page)
        <>
              
              <Button variant="ghost" className="text-gray-600 hover:text-purple-600" onClick={() => navigate('/auth')}>
                Login
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
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
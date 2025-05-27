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
  return <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50 safe-top">
      
    </nav>;
};
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const CornerIcon = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleSignOut = () => {
    signOut();
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff] transition-all duration-300">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3)]">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] border border-gray-200/50 rounded-2xl" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm text-foreground">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer text-gray-700 hover:bg-gray-50 rounded-xl mx-2 my-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05)]">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer text-gray-700 hover:bg-gray-50 rounded-xl mx-2 my-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05)]">
              <Settings className="mr-2 h-4 w-4" />
              Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2 border-gray-200" />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 hover:bg-red-50 rounded-xl mx-2 my-1 shadow-[inset_2px_2px_4px_rgba(239,68,68,0.05)] hover:shadow-[inset_4px_4px_8px_rgba(239,68,68,0.05)]">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={handleSignIn}
          className="flex items-center gap-2 bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff] border-0 text-gray-700 hover:text-gray-900 transition-all duration-300 h-12 px-4"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      )}
    </div>
  );
};
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
import { LogIn, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getNavbarIconUrl } from '@/utils/supabaseIcons';

export const MinimalHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleHomeClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

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
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 safe-top shadow-[0_4px_8px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto px-4 py-3">
        {/* Neumorphic navigation container */}
        <div className="bg-white rounded-2xl px-6 py-3 shadow-[inset_4px_4px_8px_#e5e7eb,inset_-4px_-4px_8px_#ffffff] border border-gray-100/30">
          <div className="flex items-center justify-between">
            {/* Neumorphic Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all duration-300 hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff]"
              onClick={handleHomeClick}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] border border-gray-100/50">
                <img 
                  src={getNavbarIconUrl('logo')} 
                  alt="AI Learning Platform"
                  className="w-8 h-8 object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Neumorphic Auth Actions */}
            <div className="flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff] transition-all duration-300">
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
                  className="flex items-center gap-2 bg-white shadow-[4px_4px_8px_#e5e7eb,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#e5e7eb,-2px_-2px_4px_#ffffff] border-0 text-gray-700 hover:text-gray-900 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
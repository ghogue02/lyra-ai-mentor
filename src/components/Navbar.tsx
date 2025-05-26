
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            AI Mentor
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-600 hover:text-purple-600">
            About
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-purple-600">
            Login
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

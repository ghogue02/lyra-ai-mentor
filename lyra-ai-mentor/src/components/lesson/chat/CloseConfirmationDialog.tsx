
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle } from 'lucide-react';

interface CloseConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onForceClose: () => void;
  exchangeCount: number;
}

export const CloseConfirmationDialog: React.FC<CloseConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onForceClose,
  exchangeCount
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            Continue Learning?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            You're making great progress! We recommend having at least 3 exchanges with Lyra to get the most out of this lesson. 
            You currently have {exchangeCount} exchange{exchangeCount === 1 ? '' : 's'}.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
              Keep Chatting
            </Button>
            <Button onClick={onForceClose} variant="destructive">
              Close Anyway
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

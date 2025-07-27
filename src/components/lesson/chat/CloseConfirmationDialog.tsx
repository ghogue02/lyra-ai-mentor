
import React from 'react';
import { BrandedButton } from "@/components/ui/BrandedButton";
import { BrandedDialog, BrandedDialogContent, BrandedDialogHeader, BrandedDialogTitle } from "@/components/ui/BrandedDialog";
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
    <BrandedDialog open={isOpen} onOpenChange={onClose}>
      <BrandedDialogContent variant="default" className="max-w-md">
        <BrandedDialogHeader>
          <BrandedDialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            Continue Learning?
          </BrandedDialogTitle>
        </BrandedDialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            You're making great progress! We recommend having at least 3 exchanges with Lyra to get the most out of this lesson. 
            You currently have {exchangeCount} exchange{exchangeCount === 1 ? '' : 's'}.
          </p>
          <div className="flex gap-2 justify-end">
            <BrandedButton variant="outline" onClick={onClose}>
              Keep Chatting
            </BrandedButton>
            <BrandedButton onClick={onForceClose} variant="destructive">
              Close Anyway
            </BrandedButton>
          </div>
        </div>
      </BrandedDialogContent>
    </BrandedDialog>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UserFormHeaderProps {
  isEditMode: boolean;
  onCancel: () => void;
}

export const UserFormHeader: React.FC<UserFormHeaderProps> = ({ isEditMode, onCancel }) => {
  return (
    <div className="flex justify-between items-center p-6 border-b">
      <h2 className="text-xl font-semibold">{isEditMode ? 'Modifier compte' : 'Ajouter compte'}</h2>
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="ml-auto"
      >
        <X className="h-4 w-4 mr-2" />
        Annuler
      </Button>
    </div>
  );
};


import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FactureFormHeaderProps {
  isEditing: boolean;
  onBack: () => void;
}

const FactureFormHeader = ({ isEditing, onBack }: FactureFormHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mr-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">
        {isEditing ? 'Modifier la facture' : 'Créer une nouvelle facture'}
      </h1>
    </div>
  );
};

export default FactureFormHeader;

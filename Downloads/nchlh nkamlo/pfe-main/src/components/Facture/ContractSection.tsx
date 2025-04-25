
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContractSectionProps {
  contractName: string;
  contractNumber: string;
  onChangeContractName: (value: string) => void;
  onChangeContractNumber: (value: string) => void;
}

const ContractSection = ({
  contractName,
  contractNumber,
  onChangeContractName,
  onChangeContractNumber,
}: ContractSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label htmlFor="contractName">Nom de contrat</Label>
        <Input
          id="contractName"
          value={contractName}
          onChange={(e) => onChangeContractName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="contractNumber">Numéro de contrat</Label>
        <Input
          id="contractNumber"
          value={contractNumber}
          onChange={(e) => onChangeContractNumber(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ContractSection;
